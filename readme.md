定期的にhttpアクセスして、通信にかかった時間を記録する。
設定はconfigから設定する。
pm2に登録される事を想定する。


# 使い方

- vscodeのコンソールで npx tsc を実行してtypescriptファイルをコンパイルする
- vscodeでf5を押して dist/index.jsを実行する
- もしくは、pm2 start pm2.json を実行してpm2に登録する。