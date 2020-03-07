import { Component, ContentChild, Input, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { BreadcrumbItemDirective } from './breadcrumb-item.directive';
import { BreadcrumbService } from './breadcrumb.service';
import { Breadcrumb } from './breadcrumb';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'xng-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs$: Observable<Breadcrumb[]>;
  params$: Observable<any>;
  separatorTemplate: TemplateRef<void>;

  private _separator = '/';

  /**
   * Breadcrumb item can be customized with this template
   * Template context is provided label, additional info, first and last indexes
   * Use cases:
   * 1) Add an icon along with label
   * 2) i18n. {{breadcrumb | translate}} or {{breadcrumb | transloco}}
   * 3) Change text case {{breadcrumb | titlecase}}
   */
  @ContentChild(BreadcrumbItemDirective, { static: false, read: TemplateRef }) itemTemplate;

  /**
   * If true, breacrumb is auto generated even without any mapping label
   * Default label is same as route segment
   */
  @Input() autoGenerate = true;

  /**
   * custom class provided by consumer to increase specificity
   * This will benefit to override styles that are conflicting
   */
  @Input() class = '';

  /**
   * separator between breadcrumbs, defaults to '/'.
   * User can customize separator either by passing a String or Template
   *
   * String --> Ex: <xng-breadcrumb separator="-"> </xng-breadcrumb>
   *
   * Template --> Ex: <xng-breadcrumb [separator]="separatorTemplate"> </xng-breadcrumb>
   * <ng-template #separatorTemplate><mat-icon>arrow_right</mat-icon></ng-template>
   */
  @Input('separator')
  set separator(value: string | TemplateRef<void>) {
    if (value instanceof TemplateRef) {
      this.separatorTemplate = value;
      this._separator = undefined;
    } else {
      this.separatorTemplate = undefined;
      this._separator = value || '/';
    }
  }
  get separator() {
    return this._separator;
  }

  /**
   * Provide the params list from state
   *
   * @memberof BreadcrumbComponent
   */
  @Input() allowedParams: string | [];

  constructor(private breadcrumbService: BreadcrumbService) {}

  ngOnInit() {
    this.breadcrumbs$ = this.breadcrumbService.breadcrumbs$;
  }
}
