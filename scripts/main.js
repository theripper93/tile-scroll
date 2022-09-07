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
    uniform bool tilescroll_scroll;
    uniform bool tilescroll_rotate;
    uniform float tilescroll_repeat;
    uniform vec2 tilescroll_pivot;
    varying vec2 vUvs;
  
    void main() {
      vUvs = aTextureCoord * tilescroll_repeat;
      if(tilescroll_scroll) {
        vUvs += vec2(tilescroll_time * tilescroll_speed * cos(tilescroll_direction), tilescroll_time * tilescroll_speed * sin(tilescroll_direction));
      }
      if(tilescroll_rotate) {
        vec2 textureRotate_center_uv = tilescroll_pivot;
        vec2 textureRotate_center = textureRotate_center_uv * tilescroll_repeat;
        float textureRotate_r = distance(vUvs, textureRotate_center);
        vec2 textureRotate_vUv = (vUvs - textureRotate_center) / textureRotate_center_uv;
        float textureRotate_angle = atan(textureRotate_vUv.y, textureRotate_vUv.x);
        textureRotate_angle = textureRotate_angle + tilescroll_time * tilescroll_speed;
        vec2 textureRotate_newUv = vec2(cos(textureRotate_angle), sin(textureRotate_angle)) * textureRotate_r;
        vUvs = (textureRotate_newUv) + textureRotate_center;
      }

      gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    }
  `;

  static defaultUniforms = {
    tintAlpha: [1, 1, 1, 1],
    sampler: 0,
    tilescroll_speed: 1,
    tilescroll_time: 0,
    tilescroll_direction: 0,
    tilescroll_scroll: false,
    tilescroll_rotate: false,
    tilescroll_repeat: 1,
    tilescroll_pivot: [0.5, 0.5],
  };

  _preRender(mesh) {
    super._preRender(mesh);
    this.uniforms.tilescroll_time = canvas.app.ticker.lastTime;
    this.uniforms.tilescroll_speed = (this.tile.document.flags["tile-scroll"]?.scrollSpeed ?? 1) / 10000;
    this.uniforms.tilescroll_direction = Math.toRadians(this.tile.document.flags["tile-scroll"]?.scrollDirection ?? 0);
    this.uniforms.tilescroll_scroll = this.tile.document.flags["tile-scroll"]?.enableScroll ?? false;
    this.uniforms.tilescroll_rotate = this.tile.document.flags["tile-scroll"]?.enableRotate ?? false;
    this.uniforms.tilescroll_repeat = this.tile.document.flags["tile-scroll"]?.repeat ?? 1;
    this.uniforms.tilescroll_pivot = [this.tile.document.flags["tile-scroll"]?.pivotx ?? 0.5, this.tile.document.flags["tile-scroll"]?.pivoty ?? 0.5];
  }
}

Hooks.on("drawTile", (tile, layer, context) => {
  if(tile.document.flags["tile-scroll"]?.enableScroll || tile.document.flags["tile-scroll"]?.enableRotate) {
    tile.mesh.setShaderClass(TileScrollShader);
    tile.mesh.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT
    tile.mesh.shader.tile = tile;
  }else{
    tile.mesh.setShaderClass(BaseSamplerShader);
  }
});

Hooks.on("updateTile", (tile, updates) => {
  if(!tile.object) return;
  if(updates.flags?.["tile-scroll"] !== undefined) {
    tile.object.mesh.setShaderClass(tile.flags["tile-scroll"].enableScroll || tile.flags["tile-scroll"].enableRotate ? TileScrollShader : BaseSamplerShader);
    tile.object.mesh.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT
    tile.object.mesh.texture.baseTexture.update()
    tile.object.mesh.shader.tile = tile.object;
  }
});
