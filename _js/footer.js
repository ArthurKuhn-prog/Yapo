var contacts = {
    props:{
        _home:{
            type:String,
            required:true,
        }
    },
    data: function(){
        return{
            listeContacts: this.recupContacts(),
            home: this._home,
        }
    },
    methods:{
        recupContacts: function(){
            ajaxGet(this._home+'/_php/liste_contacts.php', (retour) => {
                if(retour !== "false"){
                    this.listeContacts = JSON.parse(retour);
                    this.listeContacts.reseaux = JSON.parse(this.listeContacts.reseaux);
                }
            });
        },
    },
    template:`
    <div class="row no-gutters footer">
        <div v-if="listeContacts" 
        class="col-lg-12 mb-2">
            <div v-if="listeContacts.reseaux.length > 0" class="reseaux mb-3">
                <a v-for="(item,index) in listeContacts.reseaux"
                :key="index" :href="item.content">
                    {{item.name}}
                </a>
            </div>

            <div class="adresses">
                <p>
                    {{listeContacts.mail}}
                </p>
                <p>
                    {{listeContacts.adresse}}
                </p>
            </div> 
        </div>
        <div class="col-lg-12 mb-2 small">
                Tous les textes et images appartiennent au propriétaire de ce site<br>
                Yapo © Collectif 8h30 - 2020
            </div>
    </div> `
};

var footer = new Vue({
    el:'#footer',
    data: function(){
        return{
            verifHome: false,
            homeURL: '',
        }
    },
    components:{
        'contacts':contacts,
    },
    methods:{
        populate: function(){
            this.homeURL = homeURL;
            this.verifHome = true;
        },
    },
    template:`
    <div class="row">
        <div v-if="verifHome" class="col-lg-12 mb-2 ">
            <contacts v-bind:_home="homeURL"></contacts>
        </div>
    </div> `
})