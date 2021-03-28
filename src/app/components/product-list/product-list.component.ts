import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
import { faSave, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: any;
  currentProduct = null;
  currentIndex = -1;
  name = '';
  controls: FormArray;
  saveIcon = faSave;
  deleteIcon = faTrash;
  productNameValidationMsg: boolean;
  productDescValidationMsg: boolean;
  productPriceValidationMsg: boolean;
  productUpdateSuccessMsg: string;
  productUpdateFailMsg: string;
  showProductUpdateSuccessMsg: boolean;
  showProductUpdateFailMsg: boolean;
  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.readProducts();
  }

  readProducts(): void {
    this.productService.readAll()
      .subscribe(
        products => {
          this.products = products;
          let productNameregex = /^[a-zA-Z ]*$/;
          let productDescregex = /^[A-Za-z0-9 ]*[A-Za-z0-9][A-Za-z0-9 ]*$/;
          let productPriceregex = /^(\d+\.\d{1,2})/;
          const toGroups = this.products.map(product => {
            return new FormGroup({
              productId: new FormControl(product.productId, Validators.required),
              productName: new FormControl(product.productName, [Validators.required, Validators.maxLength(20), Validators.pattern(productNameregex)]),
              productDesc: new FormControl(product.productDesc, [Validators.required, Validators.maxLength(50), Validators.pattern(productDescregex)]),
              productPrice: new FormControl(product.productPrice, [Validators.required, Validators.maxLength(50), Validators.pattern(productPriceregex)]),
            });
          });
          this.controls = new FormArray(toGroups);
        },
        error => {
          console.log(error);
        });
  }

  getControl(index: number, field: string) : FormControl {
    return this.controls.at(index).get(field) as FormControl;
  }

  updateField(index: number, field: string) {
    const control = this.getControl(index, field);

    if (control.valid) {
      this.products = this.products.map((p, i) => {
        if (index === i) {
          return {
            ...p,
            [field]: control.value
          }
        }
        return p;
      })
    }else {
      if (field == "productName")
        this.productNameValidationMsg = true;
      else if (field == "productDesc")
        this.productDescValidationMsg = true;
      else (field == "productPrice")
        this.productPriceValidationMsg = true;
    }



  }

  refresh(): void {
    this.readProducts();
    this.currentProduct = null;
    this.currentIndex = -1;
  }

  // setCurrentProduct(product, index): void {
  //   this.currentProduct = product;
  //   this.currentIndex = index;
  // }

  saveCurrentProduct(product): void {
    //this.currentProduct = product;
    this.productService.update(product.id, product)
    .subscribe(
      response => {
        this.showProductUpdateSuccessMsg = true;
        this.productUpdateSuccessMsg = "Successfully saved updated details of product Id: " + product.productId
      },
      error => {
        this.showProductUpdateFailMsg = true;
        this.productUpdateFailMsg = "Unfortunately unable to update details of product Id: " + product.productId + ". Try Again to save the details!"
      }

    )
    //this.currentIndex = index;
  }

  deleteAllProducts(): void {
    this.productService.deleteAll()
      .subscribe(
        response => {
          console.log(response);
          this.readProducts();
        },
        error => {
          console.log(error);
        });
  }

  searchByName(): void {
    this.productService.searchByName(this.name)
      .subscribe(
        products => {
          this.products = products;
          console.log(products);
        },
        error => {
          console.log(error);
        });
  }
}