# docker_for_phaser3_vite_typescript

## 概要

ViteにてPhaser3をTypeScriptで書くためのDocker環境のサンプル。

## 利用手順

1. 当リポジトリをクローンする。あるいはzipでダウンロードする。
2. Visual Studio Codeを起動し、クローンした先のフォルダを開く。
3. vscodeのメニューから「Reopen in container」を選択する。コンテナのビルドが始まるため、しばらく放置する。
4. `cd docker_for_phaser3_vite_typescript`を実行して移動する。
5. `yarn install`を実行する。
6. `yarn dev`を実行して、ブラウザで「`localhost:8000`」にアクセスする。Phaser3の画面が表示されれば成功。3000ポートじゃないので注意。8000ポートにしている理由は注意点を参照。

## 注意点

### Viteのポート指定

`yarn dev`した際のポート番号はデフォルトポートから変更している。

```typescript
export default defineConfig({
  build: {
   //  中略
  },
  server: {
    port: 8000  // ここを追加
  }
});

```

`port`で指定しないとデフォルトとして3000ポートを使うのだが、たまたま別のコンテナで使ってたりするとポートが利用できない。わりと3000はよく使うので、最初から別のポートを使うよう`vite.config.ts`に追記している。

### `devcontainer.json`の書き換え

当リポジトリをWindowsで利用しようとしたとき、ファイル`devcontainer.json`におけるフォルダ指定を書き換える必要があった。

```json
"dockerComposeFile": [
   "..\\docker-compose.yml", # ここの行
   "docker-compose.yml"
],
```

「1つ上のフォルダにある`docker-compose.yml`」を指している部分について、本来**スラッシュ1つ**`/`だった部分を**バックスラッシュ2つ**`\\`に変更してエスケープしている。macOSなど他のプラットフォームだと問題ないのだが、Windowsに関してのみこの部分がスラッシュ1つだとうまく解釈できずエラーになった。今はどうかわからないが・・・。
