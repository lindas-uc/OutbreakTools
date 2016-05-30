function  Move(id, fromBusiness, toBusiness, date, value) {
    this.id = id;
    this.fromBusiness = fromBusiness;
    this.toBusiness = toBusiness;
    this.date = date;
    this.numberAnimals = Math.round(Math.random() * 500 + 50);
    this.value = value;
}
