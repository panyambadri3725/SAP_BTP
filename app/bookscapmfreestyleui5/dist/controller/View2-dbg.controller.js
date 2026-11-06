sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History"
], (Controller,History) => {
    "use strict";

    return Controller.extend("bookscapmfreestyleui5.controller.View2", {
        onInit() {
             this.getOwnerComponent().getRouter().getRoute('RouteView2').attachPatternMatched(this._onObjMatched, this);
        //this.getOwnerComponent().getRouter().getRoute('RouteView2').attachMatched(this._onMatched, this);
         },

        _onObjMatched(oEvent) {
            const bookid = oEvent.getParameter('arguments').ID;
            var sPath = `/BooksSet(ID=${bookid})`;
            this.getView().bindElement({
                path: sPath,
                parameters: {
                    $expand: 'chapters'
                }
            });
        },
        _onMatched(oEvent){
            debugger;
        },
        _backtoView1(oEvent){
            // window.history.go(-1);
            const oHistory = History.getInstance();
            const sPreviousHash = oHistory.getPreviousHash();
            if(sPreviousHash !== undefined){
                window.history.go(-1);
            }else{
                // fall back
                this.getOwnerComponent().getRouter().navTo('Home',{},true);
            }
        },
        _canceltohome() {
            // reset model changes
            this.getView().getModel().resetChanges();
            //replace hash
            sap.ui.core.routing.HashChanger.getInstance().replaceHash('');
        }

            });
});