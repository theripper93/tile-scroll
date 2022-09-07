Hooks.on("renderTileConfig", (app, html, data) => {
    const enableScroll = app.object.getFlag("tile-scroll", "enableScroll") ?? false;
    const enableRotate = app.object.getFlag("tile-scroll", "enableRotate") ?? false;
    const scrollSpeed = app.object.getFlag("tile-scroll", "scrollSpeed") ?? 1;
    const scrollDirection = app.object.getFlag("tile-scroll", "scrollDirection") ?? 0;
    const repeat = app.object.getFlag("tile-scroll", "repeat") ?? 1;
    const pivotx = app.object.getFlag("tile-scroll", "pivotx") ?? 0.5;
    const pivoty = app.object.getFlag("tile-scroll", "pivoty") ?? 0.5;

    const injectHtml = `
    <h3 class="form-header"><i class="fas fa-angle-double-right"></i> ${game.i18n.localize("tile-scroll.flags.header")}</h3>

    <div class="form-group">
        <label>${game.i18n.localize("tile-scroll.flags.enableScroll")}</label>
        <div class="form-fields">
            <input type="checkbox" name="flags.tile-scroll.enableScroll" ${enableScroll ? 'checked=""' : ""}>
        </div>
    </div>

    <div class="form-group">
        <label>${game.i18n.localize("tile-scroll.flags.enableRotate")}</label>
        <div class="form-fields">
            <input type="checkbox" name="flags.tile-scroll.enableRotate" ${enableRotate ? 'checked=""' : ""}>
        </div>
    </div>

    <div class="form-group">
        <label for="height">${game.i18n.localize("tile-scroll.flags.scrollDirection")} <span class="units">(Degrees)</span></label>
        <div class="form-fields">
            <input type="number" value="${scrollDirection}" step="any" name="flags.tile-scroll.scrollDirection">
        </div>
    </div>

    <div class="form-group">
        <label for="height">${game.i18n.localize("tile-scroll.flags.scrollSpeed")}</label>
        <div class="form-fields">
            <input type="number" value="${scrollSpeed}" step="any" name="flags.tile-scroll.scrollSpeed">
        </div>
    </div>

    <div class="form-group">
        <label for="height">${game.i18n.localize("tile-scroll.flags.repeat")}</label>
        <div class="form-fields">
            <input type="number" value="${repeat}" step="any" name="flags.tile-scroll.repeat">
        </div>
    </div>

    <div class="form-group">
        <label for="height">${game.i18n.localize("tile-scroll.flags.pivotx")}</label>
        <div class="form-fields">
            <input type="number" value="${pivotx}" step="any" name="flags.tile-scroll.pivotx">
        </div>
    </div>

    <div class="form-group">
        <label for="height">${game.i18n.localize("tile-scroll.flags.pivoty")}</label>
        <div class="form-fields">
            <input type="number" value="${pivoty}" step="any" name="flags.tile-scroll.pivoty">
        </div>
    </div>

    `;
    html.find('input[name="video.volume"]').closest(".form-group").after(injectHtml);
});