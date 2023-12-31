class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;

    this.queryStr = queryStr;
  }
  filter() {

    const excludeFields = ["sort", "page", "limit", "fields"];
    let queryObj = { ...this.queryStr };
    excludeFields.forEach((el) => {
      delete queryObj[el];
    });
    queryObj = JSON.stringify(queryObj);
    queryObj = queryObj.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`);
    queryObj = JSON.parse(queryObj);
    this.query = this.query.find(queryObj);
    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(",").join(" ");
   
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  limitFields() {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(",").join(" ");


      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate() {

    const page = this.queryStr.page * 1 || 1;
    const limit = this.queryStr.limit * 1 || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
 
    return this;
  }
  search() {
   
    let search = this.queryStr.search || "";
  
    let querySearch = { name: { $regex: search, options: "i" } };
    this.query = this.query.find(querySearch);
    return this;
  }
}

module.exports = ApiFeatures;
