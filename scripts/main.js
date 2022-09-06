class TileScrollShader extends BaseSamplerShader {
  get enabled() {
    return true;
  }
  set enabled(v) {}

  static classPluginName = null;

  static vertexShader = `
    precision ${PIXI.settings.PRECISION_VERTEX} float;
    attribute vec2 aVertexPosition;
    attribute vec2 aTextureCoord;
    uniform mat3 projectionMatrix;
    uniform vec2 screenDimensions;
    uniform float tilescroll_time;
    uniform float tilescroll_speed;
    uniform float tilescroll_direction;
    varying vec2 vUvs;
  
    void main() {
      vUvs = aTextureCoord + vec2(tilescroll_time * tilescroll_speed * cos(tilescroll_direction), tilescroll_time * tilescroll_speed * sin(tilescroll_direction));
      gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    }
  `;

  static defaultUniforms = {
    tintAlpha: [1, 1, 1, 1],
    sampler: 0,
    tilescroll_speed: 1,
    tilescroll_time: 0,
    tilescroll_direction: 0,
  };

  _preRender(mesh) {
    super._preRender(mesh);
    this.uniforms.tilescroll_time = canvas.app.ticker.lastTime;
    this.uniforms.tilescroll_speed = (this.tile.document.flags["tile-scroll"]?.scrollSpeed ?? 1) / 10000;
    this.uniforms.tilescroll_direction = Math.toRadians(this.tile.document.flags["tile-scroll"]?.scrollDirection ?? 0);
  }
}

Hooks.on("drawTile", (tile, layer, context) => {
  if(tile.document.flags["tile-scroll"]?.enableScroll) {
    tile.mesh.setShaderClass(BaseSamplerShader);
    tile.mesh.setShaderClass(TileScrollShader);
    tile.mesh.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT
    tile.mesh.shader.tile = tile;
  }
});
