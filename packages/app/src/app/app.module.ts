import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {MainComponent} from './pages/main/main.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ToolbarComponent} from './components/toolbar/toolbar.component';
import {NgZorroAntdModule, NZ_I18N, en_US} from 'ng-zorro-antd';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {registerLocaleData} from '@angular/common';
import en from '@angular/common/locales/en';
import {NodeEditComponent} from './components/drawers/node-edit/node-edit.component';
import { NodeToolComponent } from './components/node-tool/node-tool.component';

registerLocaleData(en);

@NgModule({
  entryComponents: [
    NodeEditComponent
  ],
  declarations: [
    AppComponent,
    MainComponent,
    ToolbarComponent,
    NodeEditComponent,
    NodeToolComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [{provide: NZ_I18N, useValue: en_US}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
