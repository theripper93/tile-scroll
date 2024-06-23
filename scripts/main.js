class TileScrollShader extends PrimaryBaseSamplerShader {
    get enabled() {
        return true;
    }
    set enabled(v) {}

    static classPluginName = null;

    static get vertexShader() {
        return `
      #version 300 es

      ${this.GLSL1_COMPATIBILITY_VERTEX}

      precision ${PIXI.settings.PRECISION_VERTEX} float;

      in vec2 aVertexPosition;
      in vec2 aTextureCoord;

      uniform vec2 screenDimensions;

      ${this._vertexShader}

      uniform mat3 projectionMatrix;


      uniform float tilescroll_time;
      uniform float tilescroll_speed;
      uniform float tilescroll_direction;
      uniform bool tilescroll_scroll;
      uniform bool tilescroll_rotate;
      uniform vec2 tilescroll_repeat;
      uniform vec2 tilescroll_pivot;
      uniform vec2 tilescroll_offset;
      uniform vec2 tilescroll_parallax;

      out vec2 vUvs;
      out vec2 vScreenCoord;

      void main() {
        vec2 vertexPosition;
        vec2 textureCoord;
        _main(vertexPosition, textureCoord);
        vUvs = aTextureCoord * tilescroll_repeat + tilescroll_offset;
        vUvs += tilescroll_parallax;

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
        vScreenCoord = vertexPosition / screenDimensions;
      }
    `;
    }

    static defaultUniforms = {
        tintAlpha: [1, 1, 1, 1],
        ambientDarkness: [0, 0, 0],
        ambientDaylight: [1, 1, 1],
        sampler: null,
        tilescroll_speed: 1,
        tilescroll_time: 0,
        tilescroll_direction: 0,
        tilescroll_scroll: false,
        tilescroll_rotate: false,
        tilescroll_repeat: [1, 1],
        tilescroll_pivot: [0.5, 0.5],
        tilescroll_offset: [0, 0],
        tilescroll_parallax: [1, 1],
    };

    _preRender(mesh) {
        super._preRender(mesh);
        this.uniforms.tilescroll_time = game.time.serverTime; //canvas.app.ticker.lastTime;
        this.uniforms.tilescroll_speed = (this.tile.document.flags["tile-scroll"]?.scrollSpeed ?? 1) / 10000;
        this.uniforms.tilescroll_direction = Math.toRadians(this.tile.document.flags["tile-scroll"]?.scrollDirection ?? 0);
        this.uniforms.tilescroll_scroll = this.tile.document.flags["tile-scroll"]?.enableScroll ?? false;
        this.uniforms.tilescroll_rotate = this.tile.document.flags["tile-scroll"]?.enableRotate ?? false;
        const repeat = this.tile.document.flags["tile-scroll"]?.repeat || 1;
        const repeatx = this.tile.document.flags["tile-scroll"]?.repeatx ?? repeat;
        const repeaty = this.tile.document.flags["tile-scroll"]?.repeaty ?? repeat;
        const parallax = (this.tile.document.flags["tile-scroll"]?.parallax ?? 0) / 10;
        this.uniforms.tilescroll_repeat = [repeatx || 1, repeaty || 1];
        this.uniforms.tilescroll_pivot = [this.tile.document.flags["tile-scroll"]?.pivotx ?? 0.5, this.tile.document.flags["tile-scroll"]?.pivoty ?? 0.5];
        this.uniforms.tilescroll_pivot[0] += 0.00000001;
        this.uniforms.tilescroll_pivot[1] += 0.00000001;
        this.uniforms.tilescroll_offset = [this.tile.document.flags["tile-scroll"]?.offsetx ?? 0, this.tile.document.flags["tile-scroll"]?.offsety ?? 0];

        const cameraCenter = canvas.stage.pivot;
        //normalize to the -1 to 1 range
        const {width, height} = canvas.scene.dimensions;
        const cameraCenterX = (cameraCenter.x / width) * 2 - 1;
        const cameraCenterY = (cameraCenter.y / height) * 2 - 1;
        this.uniforms.tilescroll_parallax = [1 + parallax * cameraCenterX, 1 + parallax * cameraCenterY];
    }
}

Hooks.on("drawTile", (tile, layer, context) => {
    if (tile.document.flags["tile-scroll"]?.enableScroll || tile.document.flags["tile-scroll"]?.enableRotate || tile.document.flags["tile-scroll"]?.parallax) {
        tile.mesh.setShaderClass(TileScrollShader);
        const repeat = tile.document.flags["tile-scroll"]?.repeat ?? 1;
        const repeatx = tile.document.flags["tile-scroll"]?.repeatx ?? repeat;
        const repeaty = tile.document.flags["tile-scroll"]?.repeaty ?? repeat;
        const useRepeat = repeatx && repeaty;
        tile.mesh.texture.baseTexture.wrapMode = useRepeat ? PIXI.WRAP_MODES.REPEAT : PIXI.WRAP_MODES.CLAMP;
        tile.mesh.texture.baseTexture.update();
        tile.mesh.shader.tile = tile;
    }
});

Hooks.on("updateTile", (tile, updates) => {
    if (!tile.object) return;
    if (updates?.flags?.["tile-scroll"] !== undefined || updates?.occlusion) {
        tile.object.mesh.setShaderClass(tile.flags["tile-scroll"].enableScroll || tile.flags["tile-scroll"].enableRotate ? TileScrollShader : PrimaryBaseSamplerShader);
        const repeat = tile.flags["tile-scroll"]?.repeat ?? 1;
        const repeatx = tile.flags["tile-scroll"]?.repeatx ?? repeat;
        const repeaty = tile.flags["tile-scroll"]?.repeaty ?? repeat;
        const useRepeat = repeatx && repeaty;
        tile.object.mesh.texture.baseTexture.wrapMode = useRepeat ? PIXI.WRAP_MODES.REPEAT : PIXI.WRAP_MODES.CLAMP;
        tile.object.mesh.texture.baseTexture.update();
        tile.object.mesh.shader.tile = tile.object;
        tile.object.draw();
    }
});
