Hooks.on("renderTileConfig", (app, html, data) => {
    const enableScroll = app.object.getFlag("tile-scroll", "enableScroll") ?? false;
    const enableRotate = app.object.getFlag("tile-scroll", "enableRotate") ?? false;
    const scrollSpeed = app.object.getFlag("tile-scroll", "scrollSpeed") ?? 1;
    const scrollDirection = app.object.getFlag("tile-scroll", "scrollDirection") ?? 0;
    const repeat = app.object.getFlag("tile-scroll", "repeat") ?? 1;
    const repeatx = app.object.getFlag("tile-scroll", "repeatx") ?? repeat;
    const repeaty = app.object.getFlag("tile-scroll", "repeaty") ?? repeat;
    const pivotx = app.object.getFlag("tile-scroll", "pivotx") ?? 0.5;
    const pivoty = app.object.getFlag("tile-scroll", "pivoty") ?? 0.5;
    const offsetx = app.object.getFlag("tile-scroll", "offsetx") ?? 0;
    const offsety = app.object.getFlag("tile-scroll", "offsety") ?? 0;
    const parallax = app.object.getFlag("tile-scroll", "parallax") ?? 0;

    const injectHtml = `
    <h3 class="form-header"><i class="fas fa-angle-double-right"></i> ${game.i18n.localize("tile-scroll.flags.header")}</h3>

    <div class="form-group slim">
        <label>${game.i18n.localize("tile-scroll.flags.enableScroll")}</label>
        <div class="form-fields">
            <label>${game.i18n.localize("tile-scroll.flags.enabled")}</label>
            <input type="checkbox" name="flags.tile-scroll.enableScroll" ${enableScroll ? 'checked=""' : ""}>
            <label>${game.i18n.localize("tile-scroll.flags.scrollDirection")}</label>
            <input type="number" value="${scrollDirection}" step="any" name="flags.tile-scroll.scrollDirection" placeholder="">
        </div>
    </div>

    <div class="form-group">
        <label>${game.i18n.localize("tile-scroll.flags.enableRotate")}</label>
        <div class="form-fields">
            <input type="checkbox" name="flags.tile-scroll.enableRotate" ${enableRotate ? 'checked=""' : ""}>
        </div>
    </div>

    <div class="form-group">
        <label for="flags.tile-scroll.scrollSpeed">${game.i18n.localize("tile-scroll.flags.scrollSpeed")}</label>
        <div class="form-fields">
        <input type="number" value="${scrollSpeed}" step="any" name="flags.tile-scroll.scrollSpeed">
        </div>

    </div>

    <div class="form-group slim">
        <label for="flags.tile-scroll.repeat">${game.i18n.localize("tile-scroll.flags.repeat")}</label>
        <div class="form-fields">
        <label>X</label>
        <input type="number" value="${repeatx}" step="any" name="flags.tile-scroll.repeatx">
        <label>Y</label>
        <input type="number" value="${repeaty}" step="any" name="flags.tile-scroll.repeaty">
        </div>
    </div>

    <div class="form-group slim">
            <label>${game.i18n.localize("tile-scroll.flags.pivot")}</label>
            <div class="form-fields">
                <label>X</label>
                <input type="number" value="${pivotx}" step="any" name="flags.tile-scroll.pivotx">
                <label>Y</label>
                <input type="number" value="${pivoty}" step="any" name="flags.tile-scroll.pivoty">
            </div>
    </div>

    <div class="form-group slim">
            <label>${game.i18n.localize("tile-scroll.flags.offset")}</label>
            <div class="form-fields">
                <label>X</label>
                <input type="number" value="${offsetx}" step="any" name="flags.tile-scroll.offsetx">
                <label>Y</label>
                <input type="number" value="${offsety}" step="any" name="flags.tile-scroll.offsety">
            </div>
    </div>

        <div class="form-group">
        <label for="flags.tile-scroll.parallax">${game.i18n.localize("tile-scroll.flags.parallax")}</label>
        <div class="form-fields">
        <input type="number" value="${parallax}" step="any" name="flags.tile-scroll.parallax">
        </div>

    </div>
    <hr>
    `;
    html.find('input[name="video.volume"]').closest(".form-group").after(injectHtml);
    app.setPosition({ height: "auto" });
});
