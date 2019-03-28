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
        loading: true,
        isMovie: false,
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
            this.isMovie = (this.$route.query.is_movie == 1)
            let proposals = []

            //時間順にソート
            this.results = _.orderBy(this.results, ['timetable.starts_at'], ['asc'])

            //現在のLT番号
            let next_id = this.$route.query.next_id
            let now_id  = 0

            if(this.$route.query.is_next) next_id ++

            this.results.forEach(proposal => {

                //LT固定
                if (proposal.timetable.length_min != 5) return

                //表示は1個
                if (proposals.length > 0) return

                //now_id
                now_id ++
                if (now_id == next_id) proposals.push(proposal)
            })
            this.isSingle = proposals.length < 2
            return proposals
        }
    },
})
