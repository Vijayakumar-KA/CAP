var router = new $.mobile.Router([{
        "#login": {handler: "loginPage", events: "bs"},
        "#home": {handler: "homePage", events: "s"},
        "#tasks": {handler: "tasksPage", events: "s"},
        "#task_detail": {handler: "taskDetailPage", events: "s"},
        "#category": {handler: "categoryPage", events: "s"}
    }],
        {
            loginPage: function (type, match, ui) {

            },
            homePage: function (type, match, ui) {
                user.headerSummary();
                setSetcitonHeight('#home .ui-content .widget-content', 2);
                showHome();
            },
            tasksPage: function (type, match, ui) {
                var params = router.getParams(match[1]);
                setSetcitonHeight('#tasks .ui-content .widget-content', 5);
                user.headerSummary();
                user.locationSummary();
                tasks.list(0, (config.limit - 1), 'main');
            },
            taskDetailPage: function (type, match, ui) {
                var params = router.getParams(match[1]);
                tasks.expand(params.id);
                setSetcitonHeight('#task_detail .ui-content .widget-content', 2.5);
                user.headerSummary();
            },
            categoryPage: function (type, match, ui) {
                var params = router.getParams(match[1]);
                tasks.listCategories(params.id, 0, (config.cat_limit - 1));
                setSetcitonHeight('#category .ui-content .widget-content', 4);
                user.headerSummary();
            }
        }, {
    ajaxApp: true,
    defaultHandler: function (type, ui, page) {
        console.log("Default handler called due to unknown route (" + type + ", " + ui + ", " + page + ")", 1);
    },
    defaultHandlerEvents: "s",
    defaultArgsRe: true
});