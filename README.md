# docker_for_react_sample

## 概要

Reactプロジェクト用のDocker環境のサンプル。

## 利用手順

1. 当リポジトリをクローンする。あるいはzipでダウンロードする。
2. Visual Studio Codeを起動し、クローンした先のフォルダを開く。
3. vscodeのメニューから「Reopen in container」を選択する。コンテナのビルドが始まるため、しばらく放置する。
4. コンテナのビルドが終わったら、シェルを開き`npx create-react-app app_name`を実行する。`app_name`の部分は任意。
   - TypeScriptで作りたい場合は`--template typescript`のオプションをつける。
5. `cd app_name`を実行してフォルダを移動する。
6. `yarn start`を実行して、ブラウザで「`localhost:3000`」にアクセスする。Reactの画面が表示されれば成功。

## 備考

当リポジトリを作成した元の環境がWindowsだったせいか、ファイル`devcontainer.json`で以下のような記述がある。

```json
"dockerComposeFile": [
   "..\\docker-compose.yml",
   "docker-compose.yml"
],
```

「1つ上のフォルダにある`docker-compose.yml`」を指している部分について、エスケープするためにバックスラッシュを2つ記述している。macOSなど、他のプラットフォームだとここがうまく解釈できず、たとえばコンテナ作成時にエラーを吐くと思われる。その場合は、バックスラッシュ2つをスラッシュ1つに修正する。
