// 3D Perlin noise adaptation
var PerlinNoise = function () {

    // multi-fractal parameters
    var
			mf_gain = 1,
			mf_lacunarity = 1,
			mf_octaves = 2;
      
		// ridged multi-fractal parameters
		var
			rmf_gain = 0.5,
			rmf_lacunarity = 0.5,
			rmf_octaves = 2,
			rmf_offset = 0.5;

    var p = [151, 160, 137, 91, 131, 15, 90, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203,
            117, 35, 11, 32, 57, 177, 244, 88, 237, 54, 65, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105,
            92, 41, 55, 46, 245, 5, 33, 102, 143, 149, 56, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 40, 159, 86, 164, 47, 109, 198, 173, 186, 3, 64, 52,
            217, 155, 250, 124, 123, 188, 202, 38, 147, 118, 255, 126, 82, 85, 212, 207, 206, 227, 50, 100, 16, 58, 129, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153,
            101, 226, 167, 43, 172, 9, 17, 22, 12, 253, 19, 98, 108, 110, 79, 84, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 144, 210, 39, 191, 179, 162, 241, 81, 51, 145,
            235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 113, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215,
            61, 156, 180];


    for (var i = 0; i < 256; i++) {
      p[256 + i] = p[i];
    }

    function fade(t) {
      return (t * t * t * (t * (t * 6 - 15) + 10));
    }


    function lerp(alpha, a, b) {
      return (a + alpha * (b - a));
    }

		
		function biLerp(alphaX, alphaY, a, b, c, d) {
			return lerp(alphaY, lerp(alphaX, c, d), lerp(alphaX, a, b));
		}


    function grad(hashCode, x, y, z) {
      // Convert lower 4 bits of hash code into 12 gradient directions
      var h = hashCode & 15;
      var u = h < 8 ? x : y;
      var v = h < 4 ? y : h == 12 || h == 14 ? x : z;

      return (((h & 1) == 0 ? u : -u) + ((h & 2) == 0 ? v : -v));
    }


		function noise (x, y, z) {
			 // Find unit cube that contains point
        var xFloor = ~~x;
        var yFloor = ~~y;
        var zFloor = ~~z;

        var iX = xFloor & 255;
        var iY = yFloor & 255;
        var iZ = zFloor & 255;

        // Find relative x, y, z of the point in the cube.
        x -= xFloor;
        y -= yFloor;
        z -= zFloor;
        
        if (x < 0) { x += 1; iX = (iX + 255) & 255; }
        if (y < 0) { y += 1; iY = (iY + 255) & 255; }
        if (z < 0) { z += 1; iZ = (iZ + 255) & 255; }
        
        // Compute fade curves for each of x, y, z
        var u = fade(x);
        var v = fade(y);
        var w = fade(z);

        // Hash coordinates of the 8 cube corners
        var A = p[iX] + iY;
        var AA = p[A] + iZ;
        var AB = p[A + 1] + iZ;
        var B = p[iX + 1] + iY;
        var BA = p[B] + iZ;
        var BB = p[B + 1] + iZ;

        // And add blended results from 8 corners of cube.
        return lerp(w, lerp(v, lerp(u, grad(p[AA], x, y, z), grad(p[BA], x - 1, y, z)), lerp(u, grad(p[AB], x, y - 1, z), grad(p[BB], x - 1, y - 1, z))), lerp(v, lerp(u, grad(p[AA + 1], x, y, z - 1), 
                grad(p[BA + 1], x - 1, y, z - 1)), lerp(u, grad(p[AB + 1], x, y - 1, z - 1), grad(p[BB + 1], x - 1, y - 1, z - 1))));
		}


		function ridge(a) {
			a = Math.abs(a);
			a = rmf_offset - a;
			a = a * a;
			return a;
		}
		
		
		function multiFractalNoise(x, y, z) {
				var 
					frequency = 1,
					signal = 1,
					weight = 1,
					result,
					i;
					
				signal = noise(x, y, z);
				result = signal;
				
				for ( i = 0; i < mf_octaves; i++) {
					x*= mf_lacunarity;
					y*= mf_lacunarity;
					z*= mf_lacunarity;
					
					weight = mf_gain * signal;
					
					if (weight > 1.0) {
						weight = 1.0;
					} else if ( weight < 0.0 ) {
						weight = 0.0;
					}
					
					signal = noise(x, y, z);
					
					signal *= weight;
					result += signal * Math.pow(frequency, -0.5);
					frequency *= mf_lacunarity;
				}
				
				return result;
		}

		
		function rigidMultiFractalNoise(x, y, z) {
			var 
				frequency = 1,
				signal = 1,
				weight = 1,
				result,
				i;
				
			signal = ridge(noise(x, y, z));
			result = signal;
			
			for ( i = 0; i < rmf_octaves; i++) {
				x*= rmf_lacunarity;
				y*= rmf_lacunarity;
				z*= rmf_lacunarity;
				
				weight = rmf_gain * signal;
				
				if (weight > 1.0) {
					weight = 1.0;
				} else if ( weight < 0.0 ) {
					weight = 0.0;
				}
				
				signal = ridge(noise(x, y, z));
				
				signal *= weight;
				result += signal * Math.pow(frequency, -0.5);
				frequency *= rmf_lacunarity;
			}
			
			return result;
		}

    return {

      // 3D perlin noise function
      noise: noise,
      
      
      // Multi fractal noise
      multiFractalNoise: multiFractalNoise,
      
      
      // Rigid fractal noise
      rigidMultiFractalNoise: rigidMultiFractalNoise,

			
			// Bi-linear interpolation
			// points create the follow square
			// a b
			// c d
			biLerp: biLerp
				
    };

};



module.exports = PerlinNoise();