import { DOCUMENT } from '@angular/common';
import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  Inject,
  OnDestroy,
} from '@angular/core';
import { DEFAULT_INSET } from './constants/box.data';
import { CustomStyle } from './constants/box.model';
import { newPosition } from './constants/box.utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent
  implements AfterViewInit, AfterViewChecked, OnDestroy {
  public boxes: number[] = [];
  public focusedBoxNo!: number;
  private idCounter: number = 0;
  private selectedBoxElement!: HTMLElement | null;
  private hasNewBox: boolean = false;

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.handleListener = this.handleListener.bind(this);
  }

  public ngAfterViewInit(): void {
    this.addEventListener();
  }

  public ngAfterViewChecked(): void {
    if (this.hasNewBox) {
      this.setNewBoxPosition();
    }
  }

  public ngOnDestroy(): void {
    this.removeEventListener();
  }

  private setSelectedBox(boxNo: number): void {
    this.selectedBoxElement = this.document.getElementById(String(boxNo));
  }

  private getStyle(): CustomStyle {
    return this.selectedBoxElement?.style || DEFAULT_INSET;
  }

  private setHorizontalPosition(isRight: boolean, columns = 1): void {
    const style = this.getStyle();
    const right = parseInt(style?.right) || 0;
    const left = parseInt(style?.left) || 0;
    const newLeft = newPosition(isRight, left, columns);
    const newRight = newPosition(isRight, right, columns);

    if (newLeft >= 0 && newRight <= 72) {
      style.left = `${newLeft}vw`;
      style.right = `${newRight}vw`;
    }
  }

  private setVerticalPosition(isDown: boolean, rows = 1): void {
    const style = this.getStyle();
    const top = parseInt(style?.top) || 0;
    const bottom = parseInt(style?.bottom) || 0;
    const newBottom = newPosition(isDown, bottom, rows);
    const newTop = newPosition(isDown, top, rows);

    if (newBottom <= 72 && newTop >= 0) {
      style.top = `${newTop}vh`;
      style.bottom = `${newBottom}vh`;
    }
  }

  private handleListener(event: KeyboardEvent): void {
    const { code } = event;

    if (code === 'ArrowLeft' || code === 'KeyA') {
      this.setHorizontalPosition(false);
    } else if (code === 'ArrowRight' || code === 'KeyD') {
      this.setHorizontalPosition(true);
    } else if (code === 'ArrowUp' || code === 'KeyW') {
      this.setVerticalPosition(false);
    } else if (code === 'ArrowDown' || code === 'KeyS') {
      this.setVerticalPosition(true);
    } else if (code === 'Delete') {
      this.selectedBoxElement?.remove();
    }
  }

  private addEventListener(): void {
    this.document.addEventListener('keydown', this.handleListener, true);
  }

  private removeEventListener(): void {
    this.document.removeEventListener('keydown', this.handleListener, true);
  }

  private setNewBoxPosition(): void {
    this.hasNewBox = false;
    this.setSelectedBox(this.idCounter);
    const rows = parseInt(String((this.idCounter - 1) / 7)) * 12;
    const columns = ((this.idCounter - 1) % 7) * 12;
    this.setHorizontalPosition(true, columns);
    this.setVerticalPosition(true, rows);
  }

  public createBox(): void {
    this.idCounter += 1;
    this.boxes.push(this.idCounter);
    this.hasNewBox = true;
    this.focusedBoxNo = this.idCounter;
  }

  public toggleListen(event: Event): void {
    const { checked } = <HTMLInputElement>event.target;

    if (checked) {
      this.addEventListener();
    } else this.removeEventListener();
  }

  public setFocus(boxNo: number): void {
    this.focusedBoxNo = boxNo;
    this.setSelectedBox(boxNo);
  }
}
