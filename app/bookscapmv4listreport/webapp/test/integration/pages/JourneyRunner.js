sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"bookscapmv4listreport/test/integration/pages/BooksSetList.gen",
	"bookscapmv4listreport/test/integration/pages/BooksSetObjectPage.gen",
	"bookscapmv4listreport/test/integration/pages/ChaptersSetObjectPage.gen"
], function (JourneyRunner, BooksSetListGenerated, BooksSetObjectPageGenerated, ChaptersSetObjectPageGenerated) {
    'use strict';

    const runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('bookscapmv4listreport') + '/test/flp.html#app-preview',
        pages: {
			onTheBooksSetListGenerated: BooksSetListGenerated,
			onTheBooksSetObjectPageGenerated: BooksSetObjectPageGenerated,
			onTheChaptersSetObjectPageGenerated: ChaptersSetObjectPageGenerated
        },
        async: true
    });

    return runner;
});

