# docker_for_react_sample

## 概要

Reactプロジェクト用のDocker環境のサンプル。

## 利用手順

1. 当リポジトリをクローンする。あるいはzipでダウンロードする。
1. 下記の2フォルダに「.（ピリオド）」をつける（GitHubにアップロードする際、ピリオドが付いているとアップロードできなかったため外した）。
  - devcontainer
  - vscode
1. Visual Studio Codeを起動し、クローンした先のフォルダを開く。
1. vscodeのメニューから「Reopen in container」を選択する。コンテナのビルドが始まるため、しばらく放置する。
1. コンテナのビルドが終わったら、シェルを開き`npx create-react-app app_name`を実行する。`app_name`の部分は任意。
1. `cd app_name`を実行してフォルダを移動する。
1. `yarn start`を実行して、ブラウザで「`localhost:3000`」にアクセスする。Reactの画面が表示されれば成功
