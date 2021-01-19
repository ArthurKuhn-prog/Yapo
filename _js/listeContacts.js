var contacts = new Vue({
    el:'#liste_contacts',
    data: function(){
        return{
            listeContacts: this.recupContacts(),
        }
    },
    components:{
    },
    methods:{
        recupContacts: function(){
            ajaxGet("_php/liste_contacts.php", (retour) => {
                if(retour){
                    this.listeContacts = JSON.parse(retour);
                    this.listeContacts.reseaux = JSON.parse(this.listeContacts.reseaux);
                    console.log(this.listeContacts);
                }
            });
        },
    },
    template:`
    <div class="row no-gutters">
        <div v-if="listeContacts" 
        class="col-lg-12 mb-2">
            Adresse: {{listeContacts.adresse}} <br>

            Mail: {{listeContacts.mail}}<br>

            Réseaux:
            <div v-for="(item,index) in listeContacts.reseaux"
            :key="index">
                <a :href="item.content">{{item.name}}</a>
            </div>
        </div>
    </div> `
});