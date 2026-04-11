import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';


@Injectable({
  providedIn: 'root',
})
export class MatPaginatorIntlLanguage extends MatPaginatorIntl {

  constructor(private translate: TranslateService) {
    super();
  }

  override itemsPerPageLabel = this.translate.instant('paginator.itemsPerPageLabel');
  override nextPageLabel = this.translate.instant('paginator.nextPageLabel');
  override previousPageLabel = this.translate.instant('paginator.previousPageLabel');
  override firstPageLabel = this.translate.instant('paginator.firstPageLabel');
  override lastPageLabel = this.translate.instant('paginator.lastPageLabel');

  override getRangeLabel = (page: number, pageSize: number, length: number): string => {
    const startIndex = page * pageSize + 1;
    const endIndex = Math.min(startIndex + pageSize - 1, length);
    return this.translate.instant('paginator.rangeLabel', { start: startIndex, end: endIndex, length });
  };
}
