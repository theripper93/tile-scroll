Hooks.on("renderTileConfig", (app, html, data) => {
    const enableScroll = app.object.getFlag("tile-scroll", "enableScroll") ?? false;
    const scrollSpeed = app.object.getFlag("tile-scroll", "scrollSpeed") ?? 1;
    const scrollDirection = app.object.getFlag("tile-scroll", "scrollDirection") ?? 0;

    const injectHtml = `
    <h3 class="form-header"><i class="fas fa-angle-double-right"></i> ${game.i18n.localize("tile-scroll.flags.header")}</h3>

    <div class="form-group">
        <label>${game.i18n.localize("tile-scroll.flags.enableScroll")}</label>
        <div class="form-fields">
            <input type="checkbox" name="flags.tile-scroll.enableScroll" ${enableScroll ? 'checked=""' : ""}>
        </div>
    </div>

    <div class="form-group">
        <label for="height">${game.i18n.localize("tile-scroll.flags.scrollSpeed")}</label>
        <div class="form-fields">
            <input type="number" value="${scrollSpeed}" step="any" name="flags.tile-scroll.scrollSpeed">
        </div>
    </div>

    <div class="form-group">
        <label for="height">${game.i18n.localize("tile-scroll.flags.scrollDirection")} <span class="units">(Degrees)</span></label>
        <div class="form-fields">
            <input type="number" value="${scrollDirection}" step="any" name="flags.tile-scroll.scrollDirection">
        </div>
    </div>
    `;
    html.find('input[name="video.volume"]').closest(".form-group").after(injectHtml);
});