# iosdc-nextup

# 想定解像度
本編は1280x720想定
is_movieは640x380想定

#parameter
## add_min
現在時刻に分数をプラスします。遅延していたりしていたら調整お願いします。
 * int
## room
部屋を追加するとその部屋だけのタイムテーブルを表示できます。追加しないと全部屋対象になります。
* 'Track A'
* 'Track B'
* 'Track C'
* 'Track D'
* 'Track E'
## is_movie
登壇中の表示モードだったら1
 * 1 or 0
## next_id
LT only
LTは時間関係なく表示するので、通し番号で表示します。