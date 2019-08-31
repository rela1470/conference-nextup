
const trackId = {
    '100周年ホール'   : 0,
    '100周年ホール A' : 1,
    '100周年ホール B' : 2,
    '丹羽ホール'      : 3,
    '1204 セミナー室' : 4,
    '1205 セミナー室' : 5,
};
const hashTag = {
    '100周年ホール'   : '#bczen',
    '100周年ホール A' : '#bc100a',
    '100周年ホール B' : '#bc100b',
    '丹羽ホール'      : '#bcniwa',
    '1204 セミナー室' : '#bc1204',
    '1205 セミナー室' : '#bc1205',
};

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
        isMovie: false
    },
    mounted() {
        this.getProposals()
    },
    methods: {
        getProposals() {
            let url = 'api/list.json';
            axios.get(url).then(response => {
                this.results = response.data
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

            this.results.forEach(proposal => {

                //データ生成
                if (proposal.speaker.avatar_url) {
                    proposal.speaker.avatar_url = 'icon/' + proposal.speaker.avatar_url.split("/").slice(-1)[0]; //urlをローカルに変更
                }
                proposal.timetable = [];
                proposal.timetable.track = proposal.room.name;
                proposal.timetable.starts_at = proposal.starts_on;
                proposal.timetable.length_min = proposal.duration / 60;

                //現在時刻
                let now = moment().add(this.$route.query.add_min, 'minutes').toISOString()
                //let now = moment('2019-03-31T14:39:00+09:00').toISOString()

                //終了時間
                proposal.timetable.end_at = moment(proposal.starts_on).add(proposal.timetable.length_min, 'minutes')

                let addMin = (proposal.title == 'ランチセッション') ? 40 : 10

                console.log(proposal);


                //is_movieがtrueだったら現在のセッションを表示
                //falseだったら次のセッションを表示
                if (
                    (this.isMovie && moment(proposal.timetable.end_at).add(addMin, 'minutes').isAfter(now) ) ||
                    (! this.isMovie && moment(proposal.timetable.starts_at).isAfter(now))
                ) {

                    //url
                    proposal.hashTag = hashTag[proposal.room.name]

                    //ルームチェック
                    if (this.$route.query.room) {
                        if (proposals.length == 0 && proposal.room.name == this.$route.query.room)
                        {
                            this.isSingle = true;
                            proposals.push(proposal)
                        }
                    }
                    else {
                        if (proposals.length < 5) proposals.push(proposal)
                    }
                }
            })
            this.isSingle = proposals.length < 5
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
