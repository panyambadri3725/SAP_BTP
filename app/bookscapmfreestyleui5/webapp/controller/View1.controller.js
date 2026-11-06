sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "../model/formatter",

], (Controller,MessageBox,formatter) => {
    "use strict";

    return Controller.extend("bookscapmfreestyleui5.controller.View1", {
        formatter: formatter,
        
        async _showChapters(oEvent) {
            var oModel = this.getView().getModel('bk');
            var oBookCtx = oEvent.getParameter('listItem').getBindingContext('bk');
            if (!oBookCtx) return;
            debugger;
            var sId = oBookCtx.getProperty('ID');
            // var sPath = "/BooksSet(ID='" + sId + "')";
            var sPath = `/BooksSet(ID=${sId})`;
            // bind context with expand
            var oCtxBinding = oModel.bindContext(sPath, null, {
                $expand : 'chapters'
            });

            var oObj = await oCtxBinding.requestObject();
            var aChapters = (oObj && oObj.chapters) ? oObj.chapters : [];

            this.getView().setModel(new sap.ui.model.json.JSONModel(aChapters), 'ch');
        },

       onInit() {
            var oDatamodel = this.getOwnerComponent().getModel(); // oData V4[cite: 17]
            this.getView().setModel(oDatamodel, 'bk');

            //Filters[cite: 17]
            var oTable = this.getView().byId('idBooksTable');
            var oBinding = oTable.getBinding('items');
            /*  var aFilters = [
                    new sap.ui.model.Filter('price','LT',15)
                ];
                oBinding.filter(aFilters); */

            // Sorters[cite: 17]
            /*  var oSorter = new sap.ui.model.Sorter("price",true);
                oBinding.sort(oSorter); */
          // this.getOwnerComponent().getRouter().attachRoutePatternMatched(this._onAnyRouteMatched,this);[cite: 17]

        },
        _onAnyRouteMatched(oEvent){
            debugger
            const name = oEvent.getParameter('name');
            const oArgs = oEvent.getParameter('arguments');
        },

        _backHome(oEvent){
            const oHistory = History.getInstance();
            const sPreviousHash = oHistory.getPreviousHash();
            if(sPreviousHash !== undefined){
                window.history.go(-1);
            }else{
                // fall back
                this.getOwnerComponent().getRouter().navTo('Home',{},true);
            }
        },
        onItemPress(oEvent) {
            // Works whether press is attached to ColumnListItem or Table itemPress
            const oItem = oEvent.getParameter("listItem") || oEvent.getSource();
            const oCtx = oItem.getBindingContext('bk') || oItem.getBindingContext();
            if (!oCtx) {
                console.error("Binding context not found");
                return;
            }
            const oObj = oCtx.getObject();
            this.getOwnerComponent().getRouter().navTo("RouteView2", {
                ID: oObj.ID
            });
        },

        async _CreateNewRecord() {
            var oModel = this.getView().getModel('bk');
            var sGroupId = 'bookcud';
            var oPayload = {
                "title" : "Rich Dad Poor Dad",
                "author" : 'Robert Kiyosaki',
                "price" : 2,
                "publishedDate" : "2026-01-10T10:30:00Z",
                "gender" : "M",
                "ageGroup" : "Adult"
            };

            var oitemsBinding = this.byId('idBooksTable').getBinding('items');
            oitemsBinding.create(oPayload);
           await oModel.submitBatch(sGroupId)
            // .then(x => {
            //     oitemsBinding.refresh(); // optional in V4
            // })
            // .catch(err => {
            //     sap.m.MessageBox.error(err.message || 'Create Failed');
            // });
        },
        async UpdateExistingRecord() {
            var oModel = this.getView().getModel('bk');
            var oTable = this.byId('idBooksTable');
            var oItem = oTable.getSelectedItem();
            var sGroupId = 'bookcud';

            if (!oItem) {
                sap.m.MessageToast.show('Select a Book First');
                return;
            }
            var oCtx = oItem.getBindingContext('bk'); // oData V4 Context

            // 1) Change Properties
            oCtx.setProperty('price', 10000);
            oCtx.setProperty('title', '-----NEW TITLE-----');

            // 2) Send to Backend (Patch )
            await oModel.submitBatch(sGroupId)
            .then(x => sap.m.MessageToast.show('Updated'))
            .catch(err => sap.m.MessageBox.error(err.message || 'Update Failed'));
        },
        DeleteExistingRecord() {
            var oTable = this.byId('idBooksTable');
            var sGroupId = 'bookcud';
            var oItem = oTable.getSelectedItem();
            if (!oItem) {
                sap.m.MessageToast.show('Select a book first');
                return;
            }

            var oCtx = oItem.getBindingContext('bk');
            var oModel = this.getView().getModel('bk');

            MessageBox.confirm("Delete this book?", {
                actions: [sap.m.MessageBox.Action.DELETE, sap.m.MessageBox.Action.CANCEL],
                emphasizedAction: sap.m.MessageBox.Action.DELETE,
                onClose: async (sAction) => {
                    if (sAction !== sap.m.MessageBox.Action.DELETE) return;

                    try {
                        await oCtx.delete(sGroupId);
                        await oModel.submitBatch(sGroupId);
                        sap.m.MessageBox.show('Deleted');

                    } catch (err) {
                        sap.m.MessageBox.error(err.message || 'Delete Failed');
                    }
                }
            });
        },
        async _batchUpdate() {
            var oModel = this.getView().getModel('bk');
            var sGroupId = 'bookcud';
            var oPayload1 = {
                "title": "Book1",
                "author": 'Author1',
                "price": 2,
                "publishedDate": "2026-01-10T10:30:00Z",
                "gender": "M",
                "ageGroup": "Adult"
            };
            var oPayload2 = {
                "title": "Book2",
                "author": 'Author3',
                "price": 2,
                "publishedDate": "2026-01-10T10:30:00Z",
                "gender": "M",
                "ageGroup": "Adult"
            };
            var oItemsBinding = this.byId('idBooksTable').getBinding('items');
            
            // To complete the batch creation:
            oItemsBinding.create(oPayload1);
            oItemsBinding.create(oPayload2);

            try {
                await oModel.submitBatch(sGroupId);
                sap.m.MessageToast.show("Batch Created Successfully");
            } catch (err) {
                sap.m.MessageBox.error(err.message || "Batch Creation Failed");
            }
        },

        async _createFragment() {
            if (!this._oCreateDialog) {
                this._oCreateDialog = await this.loadFragment({
                    name : 'bookscapmfreestyleui5.fragments.createFragment'
                });
                this.getView().addDependent(this._oCreateDialog);
            }
            const oCreateModel = new sap.ui.model.json.JSONModel({
                newBook: {
                    title : '',
                    author : '',
                    price : null,
                    publishedDate : null
                }
            });
            this.getView().setModel(oCreateModel, 'create');

            this._oCreateDialog.open();
        },

        oncancelCreate(){
            this._oCreateDialog.close();
        },

        async onSaveBook() {
            const oDataModel = this.getView().getModel('bk');
            const oCreateModel = this.getView().getModel('create');
            debugger;
            const oPayload = structuredClone(oCreateModel.getProperty('/newBook'));

            // Basic Validation
            if (!oPayload.title || !oPayload.author) {
                sap.m.MessageBox.warning('Title and Author are required');
                return;
            }

            const sGroupId = 'bookcud';
            try {
                const oListBinding = oDataModel.bindList('/BooksSet');
                const oContext = oListBinding.create(oPayload, { groupId : sGroupId });

                await oDataModel.submitBatch(sGroupId);

                await oContext.created();

                sap.m.MessageToast.show('Book Created Successfully ...!');
                this._oCreateDialog.close();
                oCreateModel.setProperty("/newBook", { title: '', author: '', price: null, publishedDate: null });
                this.byId('idBooksTable').getBinding('items').refresh();

            } catch (error) {
                sap.m.MessageBox.error(error?.message || 'Creation Failed');
            }
        },
        async _headerItemCrud() {
            const oModel = this.getView().getModel('bk');
            const sGroupId = 'bookcud';
            const oPayload = {
                title: "The Greatness Guide",
                author : "Robin Sharma",
                price: 100.22,
                publishedDate : '2026-01-13T00:00:00Z',
                chapters : [
                    {title : '3AM Club', pages:30},
                    {title : '4AM Club', pages:40},
                    {title : '5AM Club', pages:60},
                    {title : '6AM Club', pages:80},
                    {title : '7AM Club', pages:90}
                ]
            };
            try {
                const oBooksBinding = oModel.bindList('/BooksSet');
                const oCtx = oBooksBinding.create(oPayload, {groupId:sGroupId});
                await oModel.submitBatch(sGroupId);
                await oCtx.created();

                sap.m.MessageToast.show('Book + Chapters created(deep create)');
                this.byId('idBooksTable').getBinding('items').refresh();
            } catch (error) {
                sap.m.MessageBox.error(error?.message || 'Creation Failed');
            }
        },
            async _onBookValueHelp() {
                if (!this._booksfrag) {
                    this._booksfrag = await this.loadFragment({
                        name : 'bookscapmfreestyleui5.fragments.BooksVH'
                    });
                    this.getView().addDependent(this._booksfrag);
                }
                this._booksfrag.open();
            },

            onCancelBookvh() {
                this._booksfrag.close();
            },

        onBookRowPress(oEvent){
            debugger;
            var oBookTitle = oEvent.getSource().getBindingContext('bk').getObject().title;
            this.byId('idBooksVH').setValue(oBookTitle);
            this._booksfrag.close();
            this.byId('idBooksTable').getBinding('items').filter(new sap.ui.model.Filter('title','Contains',oBookTitle));
        },

        _resetBooksTable(){
            this.byId('idBooksTable').getBinding('items').filter([]);
        },



    });
});