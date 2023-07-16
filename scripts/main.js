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
    uniform vec2 tilescroll_repeat;
    uniform vec2 tilescroll_pivot;
    uniform vec2 tilescroll_offset;
    varying vec2 vUvs;
  
    void main() {
      vUvs = aTextureCoord * tilescroll_repeat + tilescroll_offset;
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
    tilescroll_repeat: [1,1],
    tilescroll_pivot: [0.5, 0.5],
    tilescroll_offset: [0, 0],
  };

  _preRender(mesh) {
    super._preRender(mesh);
    this.uniforms.tilescroll_time = game.time.serverTime;//canvas.app.ticker.lastTime;
    this.uniforms.tilescroll_speed = (this.tile.document.flags["tile-scroll"]?.scrollSpeed ?? 1) / 10000;
    this.uniforms.tilescroll_direction = Math.toRadians(this.tile.document.flags["tile-scroll"]?.scrollDirection ?? 0);
    this.uniforms.tilescroll_scroll = this.tile.document.flags["tile-scroll"]?.enableScroll ?? false;
    this.uniforms.tilescroll_rotate = this.tile.document.flags["tile-scroll"]?.enableRotate ?? false;
    const repeat = this.tile.document.flags["tile-scroll"]?.repeat || 1;
    const repeatx = this.tile.document.flags["tile-scroll"]?.repeatx ?? repeat;
    const repeaty = this.tile.document.flags["tile-scroll"]?.repeaty ?? repeat;
    this.uniforms.tilescroll_repeat = [ repeatx || 1, repeaty || 1];
    this.uniforms.tilescroll_pivot = [this.tile.document.flags["tile-scroll"]?.pivotx ?? 0.5, this.tile.document.flags["tile-scroll"]?.pivoty ?? 0.5];
    this.uniforms.tilescroll_pivot[0] += 0.00000001;
    this.uniforms.tilescroll_pivot[1] += 0.00000001;
    this.uniforms.tilescroll_offset = [this.tile.document.flags["tile-scroll"]?.offsetx ?? 0, this.tile.document.flags["tile-scroll"]?.offsety ?? 0];
  }
}

Hooks.on("drawTile", (tile, layer, context) => {
  if((tile.document.flags["tile-scroll"]?.enableScroll || tile.document.flags["tile-scroll"]?.enableRotate) && tile.document.occlusion.mode <= 1) {
    tile.mesh.setShaderClass(TileScrollShader);
    const repeat = tile.document.flags["tile-scroll"]?.repeat ?? 1;
    const repeatx = tile.document.flags["tile-scroll"]?.repeatx ?? repeat;
    const repeaty = tile.document.flags["tile-scroll"]?.repeaty ?? repeat;
    const useRepeat = repeatx && repeaty;
    tile.mesh.texture.baseTexture.wrapMode = useRepeat ? PIXI.WRAP_MODES.REPEAT : PIXI.WRAP_MODES.CLAMP;
    tile.mesh.texture.baseTexture.update()
    tile.mesh.shader.tile = tile;
  }
});

Hooks.on("updateTile", (tile, updates) => {
  if(!tile.object) return;
  if((updates?.flags?.["tile-scroll"] !== undefined || updates?.occlusion) && tile.occlusion.mode <= 1) {
    tile.object.mesh.setShaderClass(tile.flags["tile-scroll"].enableScroll || tile.flags["tile-scroll"].enableRotate ? TileScrollShader : BaseSamplerShader);
    const repeat = tile.flags["tile-scroll"]?.repeat ?? 1;
    const repeatx = tile.flags["tile-scroll"]?.repeatx ?? repeat;
    const repeaty = tile.flags["tile-scroll"]?.repeaty ?? repeat;
    const useRepeat = repeatx && repeaty;
    tile.object.mesh.texture.baseTexture.wrapMode = useRepeat ? PIXI.WRAP_MODES.REPEAT : PIXI.WRAP_MODES.CLAMP;
    tile.object.mesh.texture.baseTexture.update()
    tile.object.mesh.shader.tile = tile.object;
  }
});
