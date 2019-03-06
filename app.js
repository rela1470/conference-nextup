const forteeUri = "https://fortee.jp/phperkaigi-2019/";

const trackId = {
    'Track A' : 0,
    'Track B' : 1
};

function createUrl (path) {
    return forteeUri + path
}
function createQRUrl (url) {
    return 'https://chart.apis.google.com/chart?chs=300x300&cht=qr&chl=' + url
}

const router = new VueRouter({
    mode: 'history',
    routes: [],
})

const app = new Vue({
    router,
    el: '#app',
    data: {
        results: [],
        isSingle: true
    },
    mounted() {
        this.getProposals()
    },
    methods: {
        getProposals() {

            let url = createUrl('api/proposals/accepted')
            axios.get(url).then(response => {
                this.results = response.data.proposals
            })
                .catch(error => {
                    console.log(error)
                });
        }
    },
    computed: {
        processedProposals() {
            let proposals = [];

            //時間順にソート
            this.results = _.orderBy(this.results, ['timetable.starts_at'], ['asc'])

            this.results.forEach(proposal => {

                //let now = moment().toISOString() //'2019-03-31T10:20:00+09:00'
                let now = moment('2019-03-31T10:20:00+09:00').toISOString()
                if (moment(proposal.timetable.starts_at).isAfter(now)) {

                    //終了時間
                    proposal.timetable.end_at = moment(proposal.timetable.starts_at).add(proposal.timetable.length_min, 'minutes')

                    //url
                    proposal.url = createUrl('proposal/' + proposal.uuid)
                    proposal.qr  = createQRUrl(proposal.url);

                    //ルームチェック
                    if (this.$route.query.room) {
                        if (proposals.length == 0 && proposal.timetable.track == this.$route.query.room)
                        {
                            console.log('hit')
                            this.isSingle = true;
                            proposals.push(proposal)
                        }
                    }
                    else {
                        if (proposals.length < 2) proposals.push(proposal)
                    }
                }
            })
            this.isSingle = proposals.length < 2
            return proposals
        }
    },
    filters: {
        moment: function (date) {
            return moment(date).format('HH:mm')
        }
    }
})
