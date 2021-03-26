#extension GL_OES_standard_derivatives : enable
precision mediump float;

varying float vElevation;
varying vec3 vViewPosition;

void main()
{
  vec3 normal = normalize( cross( dFdx( vViewPosition ), dFdy( vViewPosition ) ) );
  vec3 lightPos = normalize(vec3( - 8000, 2000, 1000));
  float lDot = dot(normal, lightPos);
  float volume = max(0.0, lDot);
  vec3 lightColor = mix(vec3(0.02,0.2,0.3), vec3(0.8,0.95,1), volume);
    
    // if (disableRefl < 0.2) {
    //     texel = texture2DProj(reflection, mirrorCoord).rgb;
    //     vec3 mixColor = mix(lightColor, texel, length(texel));
    //     lightColor = mix(lightColor, mixColor, 0.25);
    // }
    
    // float depth = abs(2500.0 - vPos.z);
    // float fogFactor = smoothstep(fogNear, fogFar, depth);
    
    // lightColor += orbColor * (vInteract * 0.9);
    
    gl_FragColor = vec4(lightColor, 0.85);
  //   gl_FragColor = mix(gl_FragColor, vec4(fogColor, gl_FragColor.w), fogFactor);

  // gl_FragColor = vec4(normal * 0.5 + 0.5, 1.0);
}