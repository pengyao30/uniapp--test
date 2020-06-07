export default class productMsg{
	constructor(productList,index){
		this.id = productList.id,
	    this.imgUrl = productList.image//轮播图
		this.img = productList.image[0]//遮罩层
		this.description = productList.description
		this.attrGroup = productList.attrGroup
		this.attrItems = productList.attrItems
		this.on_sale = productList.on_sale
		this.service_tags = productList.service_tags[0]
		this.price = productList.skus[index].price
		this.market_price = productList.skus[index].market_price
		this.sold_count = productList.skus[index].sold_count
		this.stock = productList.skus[index].stock
		this.name = productList.unit.name
		this.value = productList.skus[index].value,
		this.favorite = 0
	}
}
