sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("bookscapmfreestyleui5.controller.Home", {

        onBooksLibrary: function () {
            this.getOwnerComponent()
                .getRouter()
                .navTo("RouteView1"); // Books List
        },

        onLogin: function () {
            sap.m.MessageToast.show("Login clicked");
        },

        onSignup: function () {
            sap.m.MessageToast.show("Signup clicked");
        },

        onContact: function () {
            sap.m.MessageToast.show("Contact Us clicked");
        }
    });
});