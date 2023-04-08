# docker_for_nodejs

## 概要

Expressプロジェクト用のDocker環境のサンプル。

## 利用手順

1. 当リポジトリをクローンする。あるいはzipでダウンロードする。
2. Visual Studio Codeを起動し、クローンした先のフォルダを開く。
3. vscodeのメニューから「Reopen in container」を選択する。コンテナのビルドが始まるため、しばらく放置する。
4. コンテナのビルドが終わったら、シェルを開き`mkdir app_name`を実行する。`app_name`の部分は任意。
5. `cd app_name`を実行してフォルダを移動する。
6. `npx express-generator`を実行する。初回は`express-generatorをインストールする？`と聞かれるはずなのでy（yes）を入力する。
1. `npm install`を実行する。
1. `npm start`を実行して、ブラウザで「`localhost:3000`」にアクセスする。Expressの画面が表示されれば成功。

## `nodemon`のインストール

`npm install -D nodemon`を実行して[nodemon](https://nodemon.io/)をインストールしておくと便利。

```json
"scripts": {
 "dev": "nodemon ./bin/www",  # この行を追加
 "start": "node ./bin/www"
},
```

その際、上記のように`package.json`の`scripts`部分に1行追加して、開発時は`nodemon`がデフォルトで実行されるよう変更しておく。開発の際は`npm run dev`と実行することで、`nodemon`が実行されるようになる。

## TypeScriptのインストール

TypeScriptでコードを書きたい場合、環境を準備する必要がある。

```console
npm install -D typescript @types/express @types/cookie-parser @types/morgan @types/http-errors
npx tsc --init
```

この時点ではTypeScriptからJavaScriptにコンパイルされた際、TSファイルが存在するフォルダと同じ場所にJSファイルが作成される。TSファイルとJSファイルが同じ場所にあると管理が面倒なので、コンパイル先を別のフォルダに設定する。

```console
mkdir dist
```

出力先のフォルダを作成する。ただ、フォルダを作成しただけではダメなので、`tsconfig.json`も書き換える。

```json
"allowJs": true,       /* Allow javascript files to be compiled. */
"outDir": "./dist",    /* Redirect output structure to the directory. */
```

正確には上記の項目がそれぞれもともとコメントアウトされていると思うので、コメントを外して必要な追記を行う感じ。出力先フォルダを先ほど作成した`dist`に設定し、JSファイルと共存させるため`allowJs`を有効にする。

```console
/**
 * Module dependencies.
 */

var app = require('../dist/app');
var debug = require('debug')('app:server');
```

さらにExpressが起動した際に参照するフォルダを`dist`に変更するため、`bin/www`も上記のとおり書き換える。

これでTypeScriptでの開発が可能な環境となる。

## 注意点

当リポジトリをWindowsで利用しようとしたとき、ファイル`devcontainer.json`におけるフォルダ指定を書き換える必要があった。

```json
"dockerComposeFile": [
   "..\\docker-compose.yml", # ここの行
   "docker-compose.yml"
],
```

「1つ上のフォルダにある`docker-compose.yml`」を指している部分について、本来**スラッシュ1つ**`/`だった部分を**バックスラッシュ2つ**`\\`に変更してエスケープしている。macOSなど他のプラットフォームだと問題ないのだが、Windowsに関してのみこの部分がスラッシュ1つだとうまく解釈できずエラーになった。今はどうかわからないが・・・。
