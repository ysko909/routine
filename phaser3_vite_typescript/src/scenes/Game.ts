import Phaser from 'phaser';
import dayjs from 'dayjs';

// 時間経過とともに変化する長方形を表すクラス
class ProgressRect extends Phaser.GameObjects.Rectangle {
  private _startDate: dayjs.Dayjs;
  private _endDate: dayjs.Dayjs;
  private _imageTexture: string;
  private _image: Phaser.GameObjects.Image;
  private _isActive = true;
  public startPositionLine: Phaser.GameObjects.Line;
  public endPositionLine: Phaser.GameObjects.Line;

  constructor(scene: Phaser.Scene, startDate: dayjs.Dayjs, endDate: dayjs.Dayjs, x: number, y: number, width: number, height: number, fillColor: number, imageTexture: string, imageSetScale = 1) {
    // 親クラスのコンストラクタ呼び出し 
    super(scene, x, y, width, height, fillColor);

    // その他の初期化処理
    this._startDate = startDate;
    this._endDate = endDate;

    this._imageTexture = imageTexture;

    this.setOrigin(0, 0);

    this._image = scene.add.image(x - 90, y, this._imageTexture);
    this._image.setOrigin(0, 0);
    this._image.setScale(imageSetScale);

    this.startPositionLine = scene.add.line(x, y - 15, 0, 0, 0, height + 30, fillColor).setOrigin(0, 0);
    this.endPositionLine = scene.add.line(x + width - 1, y - 15, 0, 0, 0, height + 30, fillColor).setOrigin(0, 0);
  }

  // 長方形のサイズ変更処理
  updateSize(nowDate: dayjs.Dayjs) {
    if (nowDate <= this._endDate) {
      // this._isActive = true;
    } else {
      // 規定の時間を経過した場合は無効化しグレーアウトさせる
      this._isActive = false;
      this.setFillStyle(0xdddddd);
    }

    // アクティブな場合のみ矩形のサイズを変更する
    if (this._isActive) {
      if (nowDate < this._startDate) {
        this.setScale(0, 1);
      } else {
        let lapseRate = nowDate.diff(this._startDate) / this._endDate.diff(this._startDate);
        if (lapseRate <= 1) {
          this.setScale(lapseRate, 1);
        }
      }
    }
  }

  get isActive() {
    return this._isActive;
  }

  get startDate() {
    return this._startDate;
  }
}

export default class Demo extends Phaser.Scene {
  private _limit: number;
  public counter: number;
  private _date: dayjs.Dayjs;
  public timeText!: Phaser.GameObjects.Text;

  public eatBreakfast!: ProgressRect;
  public getDressed!: ProgressRect;
  public brushingTeeth!: ProgressRect;

  public objectLayer!: Phaser.GameObjects.Layer;
  public textLayer!: Phaser.GameObjects.Layer;

  constructor() {
    super('GameScene');

    // 画面更新のタイミング調整用プロパティ
    this._limit = 60;
    this.counter = 0;

    this._date = dayjs();
  }

  get limit() {
    return this._limit;
  }

  preload() {
    // アセットのロード
    this.load.image('logo', 'assets/phaser3-logo.png');
    this.load.image('baby', 'assets/baby.png');
    this.load.image('getDressed', 'assets/get-dressed.png');
    this.load.image('brushingTeeth', 'assets/teeth-brushing.png');
    this.load.image('reload', 'assets/reload.png');
  }

  create() {

    // レイヤー設定
    this.objectLayer = this.add.layer(); // 矩形やテキストのためのレイヤー
    this.textLayer = this.add.layer();  // 更新をうながすテキストのためのレイヤー

    // 時間表示のためのテキストオブジェクト
    this.timeText = this.add.text(30, 50, "");
    this.timeText.setFontSize(37);

    this.objectLayer.add(this.timeText);

    const margin = 50;
    // ゲーム画面のサイズを取得
    const { width, height } = this.game.canvas;
    const barWidth = width - (3 * margin);

    // テキストの表示
    let textStart = this.add.text(60, 140, 'Start');
    textStart.setFontSize(30);
    this.objectLayer.add(textStart);

    let textEnd = this.add.text(barWidth + 70, 140, 'End');
    textEnd.setFontSize(30);
    this.objectLayer.add(textEnd);

    // 矩形オブジェクトを生成
    // 朝食
    const eatBreakfastStart = this._date.set('hour', 6).set('minute', 40).set('second', 0);
    const eatBreakfastEnd = eatBreakfastStart.add(40, 'minute');
    this.eatBreakfast = new ProgressRect(this,
      eatBreakfastStart,
      eatBreakfastEnd,
      margin * 2, 200, barWidth, 70, 0xb84284, 'baby', 0.15);
    this.add.existing(this.eatBreakfast);
    this.objectLayer.add(this.eatBreakfast);

    // 着替え
    const getDressedStart = eatBreakfastEnd;
    const getDressedEnd = getDressedStart.add(5, 'minute');
    this.getDressed = new ProgressRect(this,
      getDressedStart,
      getDressedEnd,
      margin * 2, 320, barWidth, 70, 0x27b38f, 'getDressed', 0.15);
    this.add.existing(this.getDressed);
    this.objectLayer.add(this.getDressed);

    // 歯磨き
    const brushingTeethStart = getDressedEnd;
    const brushingTeethEnd = brushingTeethStart.add(5, 'minute');
    this.brushingTeeth = new ProgressRect(this,
      brushingTeethStart,
      brushingTeethEnd,
      margin * 2, 440, barWidth, 70, 0xf7cc60, 'brushingTeeth', 0.15);
    this.add.existing(this.brushingTeeth);
    this.objectLayer.add(this.brushingTeeth);

    // 日付が変わったため更新を促すテキスト
    const rectForText = this.add.rectangle(120, 150, width - 240, 400, 0x362466);
    rectForText.setOrigin(0, 0);
    this.textLayer.add(rectForText);
    const textHoge = this.add.text(width / 2, height / 2, '更新ボタンを押してね');
    textHoge.setOrigin(0.5, 0.5);
    textHoge.setFontSize(40);
    this.textLayer.add(textHoge);
  }

  update(): void {
    let now = dayjs();
    this.counter++;

    // オブジェクトの日付と当日が異なる場合は更新をうながすテキストを表示する
    if (now.day() === this.eatBreakfast.startDate.day()) {
      this.textLayer.setVisible(false);
    } else {
      this.textLayer.setVisible(true);
    }

    // 一定フレーム経過後のみ画面を更新する
    if (this.counter > this.limit) {
      this.eatBreakfast.updateSize(now);
      this.getDressed.updateSize(now);
      this.brushingTeeth.updateSize(now);

      this.timeText.setText(now.format('YYYYねんMがつDにち HHじmふんsびょう'));
      this.counter = 0;
    }

  }

}
