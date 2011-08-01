#include <v8.h>
#include <node.h>

using namespace node;
using namespace v8;

class Map: node::ObjectWrap
{
  private:
  public:
    Map();
    ~Map();
    
    static v8::Persistent<FunctionTemplate> persistent_function_template;
    
    static void Init(Handle<Object> target) {
      // Wrap our C++ New() method so that it's accessible from Javascript
      // This will be called by the new operator in Javascript, for example: new notification();
      v8::Local<FunctionTemplate> local_function_template = v8::FunctionTemplate::New(New);
    
      // Make it persistent and assign it to persistent_function_template which is a static attribute of our class.
      Map::persistent_function_template = v8::Persistent<FunctionTemplate>::New(local_function_template);
      
      // Each JavaScript object keeps a reference to the C++ object for which it is a wrapper with an internal field.
      Map::persistent_function_template->InstanceTemplate()->SetInternalFieldCount(1); // 1 since a constructor function only references 1 object
      // Set a "class" name for objects created with our constructor
      Map::persistent_function_template->SetClassName(v8::String::NewSymbol("Map"));
      
      
      // This is a Node macro to help bind C++ methods to Javascript methods (see https://github.com/joyent/node/blob/v0.2.0/src/node.h#L34)
      // Arguments: our constructor function, Javascript method name, C++ method name
      NODE_SET_PROTOTYPE_METHOD(Map::persistent_function_template, "getRegionMap", GetRegionMap);
      
      // Set the "notification" property of our target variable and assign it to our constructor function
      target->Set(String::NewSymbol("Map"), Gtknotify::persistent_function_template->GetFunction());
     
    }
    
    
    // new Notification();
    // This is our constructor function. It instantiate a C++ Gtknotify object and returns a Javascript handle to this object.
    static Handle<Value> New(const Arguments& args) {
      HandleScope scope;
      Map* map_instance = new Map();
      
      // Wrap our C++ object as a Javascript object
      map_instance->Wrap(args.This());
      
      
      // Our constructor function returns a Javascript object which is a wrapper for our C++ object, 
      // This is the expected behavior when calling a constructor function with the new operator in Javascript.
      return args.This();
    }

}



/ *
  *
  * Interface with V8
  *
  * /
  
v8::Persistent<FunctionTemplate> Map::persistent_function_template;

extern "C" { // Cause of name mangling in C++, we use extern C here
  static void init(Handle<Object> target) {
    Map::Init(target);
  }
  // @see http://github.com/ry/node/blob/v0.2.0/src/node.h#L101
  NODE_MODULE(map, init);
}
