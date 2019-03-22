const forteeUri = "https://fortee.jp/phperkaigi-2019/";

const trackId = {
    'Track A' : 0,
    'Track B' : 1
};
const hashTag = {
    'Track A' : '#phperkaigi #a',
    'Track B' : '#phperkaigi #b'
};

function createUrl (path) {
    return forteeUri + path
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
        isSingle: true,
        loading: true
    },
    mounted() {
        this.getProposals()
    },
    methods: {
        getProposals() {

            let url = createUrl('api/proposals/accepted')
            axios.get(url).then(response => {
                this.results = response.data.proposals
                this.loading = false
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

                let now = moment().add(this.$route.query.add_min, 'minutes').toISOString()
                //let now = moment('2019-03-31T10:20:00+09:00').toISOString()
                if (moment(proposal.timetable.starts_at).isAfter(now)) {

                    //終了時間
                    proposal.timetable.end_at = moment(proposal.timetable.starts_at).add(proposal.timetable.length_min, 'minutes')

                    //url
                    proposal.url = createUrl('proposal/' + proposal.uuid)
                    proposal.hashTag = hashTag[proposal.timetable.track]

                    //ルームチェック
                    if (this.$route.query.room) {
                        if (proposals.length == 0 && proposal.timetable.track == this.$route.query.room)
                        {
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
        moment_time: function (date) {
            return moment(date).format('HH:mm')
        },
        moment_day: function (date) {
            return moment(date).format('M/D (ddd)')
        }
    }
})
