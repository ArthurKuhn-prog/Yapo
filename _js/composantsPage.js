var txt_court = {
    props:{
        _contenu:{
            type: String,
            required: true,
        },
    },
    data:function(){
        return{
            contenu: this._contenu,
        }
    },
    template:`
    <div v-if="contenu !== ''" 
    class="txt_court">
        <em>{{contenu}}</em>
    </div> `
};

var txt_long = {
    props:{
        _contenu:{
            type: String,
            required: true,
        },
    },
    data:function(){
        return{
        }
    },
    computed:{
        contenu: function(){
            return marked(this._contenu, { sanitize: true })
        }
    },
    template:`
    <div v-if="contenu !== ''" 
    class="txt_long" 
    v-html="contenu">
    </div> `
};

var liste_infos = {
    props:{
        _contenu:{
            type:Array,
            required:true,
        }
    },
    data: function(){
        return{
            infos: this._contenu,
        }
    },
    template: `
    <div class="liste_infos mb-4 mr-5">
        <div v-if="infos.length > 0" 
        v-for="(item,index) in infos" :key="index"
        class="infos">
            {{item.infos}}
        </div>
    </div> `
}

var media = {
    props:{
        _contenu:{
            type: Array,
            required:true,
        }
    },
    data: function(){
        return{
            medias: this._contenu,
        }
    },
    template:`
    <div v-if="medias.length > 0">
        <div v-for="(item,index) in medias"
        :key="index">
            <div v-if="item.url_media" class="medias_container">
                <div v-html="item.url_media" class="medias">
                </div>
            </div>
        </div>
    </div> `
};

var upl_fchs = {
    props:{
        _contenu:{
            type: Array,
            required:true,
        },
    },
    data: function(){
        return{
            images: [],
            homeURL: homeURL,
        }
    },
    created:function(){
        for(var i = 0; i < this._contenu.length; i ++){
            if(this._contenu[i].show){
                this.images.push(this._contenu[i]);
            }
        }
    },
    template:`
    <div>
        <div v-if="images.length > 0">
            <div v-if="images.length > 1">
                <div class="images_container">
                    <div v-for="(item,index) in images"
                    :key="index">
                        <a v-if="item.ext !== 'pdf' && item.ext !== 'PDF'" :href="homeURL+'/'+item.url" data-lightbox="img">
                            <img class="img-fluid images"
                            :src="homeURL+'/'+item.url" :alt="item.name" />
                        </a>

                        <a v-else :href="homeURL+'/'+item.url" target="_blank">
                            <img class="img-fluid images file" style="max-height:15vh;"
                            :src="homeURL+'/_css/pdf_icon.svg'" :alt="item.name">
                            {{item.name}}
                        </a>
                    </div>
                </div>

                <div class="images_container_mobile">
                    <div v-for="(item,index) in images"
                    :key="index">
                        <a v-if="item.ext !== 'pdf' && item.ext !== 'PDF'" :href="homeURL+'/'+item.url" data-lightbox="img">
                            <img :src="homeURL+'/'+item.url" :alt="item.name" />
                        </a>

                        <a v-else :href="homeURL+'/'+item.url" target="_blank">
                            <img class="img-fluid images file"
                            :src="homeURL+'/_css/pdf_icon.svg'" :alt="item.name">
                            {{item.name}}
                        </a>
                    </div>
                </div>
            </div>

            <div v-else>
                <div v-for="(item,index) in images"
                :key="index" class="monoimage_container">
                    <a v-if="item.ext !== 'pdf' && item.ext !== 'PDF'" :href="homeURL+'/'+item.url" 
                    data-lightbox="img">
                    <img class="img-fluid monoimage"
                    :src="homeURL+'/'+item.url" :alt="item.name" />
                    </a>

                    <a v-else :href="homeURL+'/'+item.url" target="_blank">
                        <img class="img-fluid monoimage file"
                        :src="homeURL+'/_css/pdf_icon.svg'" :alt="item.name">
                        {{item.name}}
                    </a>
                </div>
            </div>
        </div>
    </div> `
};