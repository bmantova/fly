class Loader {
    loadObj(name) {
        /*var manager = new THREE.LoadingManager();
        var loader = new THREE.OBJLoader(manager)
        var self = this;
        return new Promise((resolve, reject) => {
            loader.load("./assets/"+name+".obj",function(obj){
                self.models[name] = obj;
                resolve(obj);
            },()=>{},reject);
        });*/

        var self = this;

        return new Promise((resolve, reject) => {
            new THREE.MTLLoader()
                .setPath( './assets/' )
                .load( name+'.mtl', function ( materials ) {

                    materials.preload();

                    new THREE.OBJLoader()
                        .setMaterials( materials )
                        .setPath( './assets/' )
                        .load( name+'.obj', function ( object ) {

                            self.models[name] = object;
                            resolve();
                        }, ()=>{}, ()=>{} );

                } );
        });
    }
    loaded(callback) {
        this.afterLoad = callback;
    }
    init() {
        this.numberLoaded = 0;
        var self = this;
        Loader.modelsNames.forEach(name => {
            self.loadObj(name).then(()=>{self.checkLoad()});
        })
    }
    checkLoad() {
        this.numberLoaded++;
        if(this.numberLoaded >= Loader.modelsNames.length) {
            this.isLoad = true;
            if(this.afterLoad !== false) this.afterLoad();
        }
    }
    constructor(){
        this.isLoad = false;
        this.models = [];
        this.init();
        this.afterLoad = false;
    }
}
Loader.modelsNames = ['plane','plane2','map','bullet','explode','wingsuit','newMap']