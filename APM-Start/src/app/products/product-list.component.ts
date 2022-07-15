import { ProductService } from './product.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { filter, Subscription } from 'rxjs';
import { IProduct } from './product';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit, OnDestroy {
  pageTitle: string = 'Product List';
  imageWidth: number = 50;
  imageMargin: number = 2;
  showImage = false;
  errorMessage: string = '';
  sub!: Subscription;

  private _listFilter = '';
  get listFilter(): string {
    return this._listFilter;
  }

  set listFilter(value: string) {
    this._listFilter = value;
    this.filteredPrpducts = this.performFilter(value);
  }
  products: IProduct[] = [];

  constructor(private productService: ProductService) {}
	
  filteredPrpducts: IProduct[] = [];
  toggleImage(): void {
    this.showImage = !this.showImage;
  }

  ngOnInit(): void {
    this.sub = this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredPrpducts = this.products;
      },
      error: (err) => (this.errorMessage = err),
    });

    this.listFilter = 'cart';
  }

  ngOnDestroy(): void {
	this.sub.unsubscribe();
}


  performFilter(filterBy: string): IProduct[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.products.filter((product: IProduct) =>
      product.productName.toLocaleLowerCase().includes(filterBy)
    );
  }

  onRatingClicked(message: string): void {
    this.pageTitle = 'Product List: ' + message;
  }
}
