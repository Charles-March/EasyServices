import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { UseExampleModule } from './example/use-example.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, UseExampleModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
