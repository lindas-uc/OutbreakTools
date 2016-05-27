function  Move(id, fromBusiness, toBusiness, date) {
    this.id = id;
    this.fromBusiness = fromBusiness;
    this.toBusiness = toBusiness;
    this.date = date;
    this.businessType = "Schlachthof";
    this.numberAnimals = Math.random() * 500 + 50;
    this.value = 1;
}
