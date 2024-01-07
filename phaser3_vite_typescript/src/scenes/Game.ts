import Phaser from 'phaser';
import dayjs from 'dayjs';

class ProgressRect extends Phaser.GameObjects.Rectangle {
  private _startTime: dayjs.Dayjs;
  private _endTime: dayjs.Dayjs;
  private _imageTexture: string;
  private _image: Phaser.GameObjects.Image;
  private _isActive = true;
  public startPositionLine: Phaser.GameObjects.Line;
  public endPositionLine: Phaser.GameObjects.Line;


  constructor(scene: Phaser.Scene, startTime: dayjs.Dayjs, endTime: dayjs.Dayjs, x: number, y: number, width: number, height: number, fillColor: number, imageTexture: string, imageSetScale = 1) {
    super(scene, x, y, width, height, fillColor);

    this._startTime = startTime;
    this._endTime = endTime;

    this._imageTexture = imageTexture;

    this.setOrigin(0, 0);

    this._image = scene.add.image(x - 90, y, this._imageTexture);
    this._image.setOrigin(0, 0);
    this._image.setScale(imageSetScale);

    this.startPositionLine = scene.add.line(x, y - 15, 0, 0, 0, height + 30, fillColor).setOrigin(0, 0);
    this.endPositionLine = scene.add.line(x + width - 1, y - 15, 0, 0, 0, height + 30, fillColor).setOrigin(0, 0);
  }

  updateSize(nowTime: dayjs.Dayjs) {
    if (nowTime <= this._endTime) {
      this._isActive = true;
    } else {
      this._isActive = false;
      this.setFillStyle(0xdddddd);
    }

    if (this._isActive) {
      if (nowTime < this._startTime) {
        this.setScale(0, 1);
      } else {
        let lapseRate = nowTime.diff(this._startTime) / this._endTime.diff(this._startTime);
        if (lapseRate <= 1) {
          this.setScale(lapseRate, 1);
        }
      }
    }
  }

  get isActive() {
    return this._isActive;
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

  constructor() {
    super('GameScene');

    this._limit = 60;
    this.counter = 0;

    this._date = dayjs();

  }

  get limit() {
    return this._limit;
  }

  preload() {
    this.load.image('logo', 'assets/phaser3-logo.png');
    this.load.image('baby', 'assets/baby.png');
    this.load.image('getDressed', 'assets/get-dressed.png');
    this.load.image('brushingTeeth', 'assets/teeth-brushing.png');
  }

  create() {

    this.timeText = this.add.text(70, 50, "");
    this.timeText.setFontSize(40);

    const margin = 50;
    // ゲーム画面のサイズを取得
    const { width, height } = this.game.canvas;
    const barWidth = width - (3 * margin);

    let textStart = this.add.text(60, 140, 'Start');
    textStart.setFontSize(30);

    let textEnd = this.add.text(barWidth + 70, 140, 'End');
    textEnd.setFontSize(30);

    const eatBreakfastStart = this._date.set('hour', 6).set('minute', 30).set('second', 0);
    const eatBreakfastEnd = eatBreakfastStart.add(30, 'minute');
    this.eatBreakfast = new ProgressRect(this,
      eatBreakfastStart,
      eatBreakfastEnd,
      margin * 2, 200, barWidth, 70, 0xb84284, 'baby', 0.15);
    this.add.existing(this.eatBreakfast);

    const getDressedStart = eatBreakfastEnd;
    const getDressedEnd = getDressedStart.add(15, 'minute');
    this.getDressed = new ProgressRect(this,
      getDressedStart,
      getDressedEnd,
      margin * 2, 320, barWidth, 70, 0x27b38f, 'getDressed', 0.15);
    this.add.existing(this.getDressed);

    const brushingTeethStart = getDressedEnd;
    const brushingTeethEnd = brushingTeethStart.add(5, 'minute');
    this.brushingTeeth = new ProgressRect(this,
      brushingTeethStart,
      brushingTeethEnd,
      margin * 2, 440, barWidth, 70, 0xf7cc60, 'brushingTeeth', 0.15);
    this.add.existing(this.brushingTeeth);

    console.log('breakfast' + eatBreakfastStart.format() + ' _ ' + eatBreakfastEnd.format());
    console.log('getdressed' + getDressedStart.format() + ' _ ' + getDressedEnd.format());
    console.log('brush' + brushingTeethStart.format() + ' _ ' + brushingTeethEnd.format());
    // this.tweens.add({
    //   targets: logo,
    //   y: 350,
    //   duration: 1500,
    //   ease: 'Sine.inOut',
    //   yoyo: true,
    //   repeat: -1
    // });
  }

  update(): void {
    let now = dayjs();
    this.counter++;

    if (this.counter > this.limit) {
      this.eatBreakfast.updateSize(now);
      this.getDressed.updateSize(now);
      this.brushingTeeth.updateSize(now);

      this.timeText.setText(now.format('YYYY/MM/DD HH:mm:ss'));
      this.counter = 0;
    }

  }

}
