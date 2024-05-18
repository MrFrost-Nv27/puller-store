class Puller {
  _datasetprop = function (
    prop = {
      name: "",
      url: "",
      method: "",
      param: "",
      wrap: "",
      data: [],
      callbacks: [],
    }
  ) {
    this.callbacks = prop.callbacks;
    this.name = prop.name;
    this.url = prop.url;
    this.data = prop.data;
    this.method = prop.method;
    this.param = prop.param;
    this.wrap = prop.wrap;
  };
  datasets = [];
  constructor() {}

  get(...name) {
    let iterator = [];
    let result = {};
    if (Array.isArray(name[0])) {
      if (name[0].map((l) => typeof l == "string").includes(false)) return false;
      iterator = name[0];
    } else {
      if (name.map((l) => typeof l == "string").includes(false)) return false;
      iterator = name;
    }
    iterator.map((key) => {
      if (this.datasets.find((v) => v.name == key)) {
        result[key] = this.datasets.find((v) => v.name == key).data;
      }
    });

    if (result == {}) {
      return false;
    }
    return Object.keys(result).length == 1 ? result[Object.keys(result)[0]] : result;
  }

  addCallback(name = "", callback = function () {}) {
    if (this.datasets.find((key) => name == key.name)) {
      this.datasets.find((key) => name == key.name).callbacks.push(callback);
    }
    return this;
  }

  async pull(...name) {
    let iterator = [];
    if (Array.isArray(name[0])) {
      if (name[0].map((l) => typeof l == "string").includes(false)) return false;
      iterator = name[0];
    } else {
      if (name.map((l) => typeof l == "string").includes(false)) return false;
      iterator = name;
    }
    if (undefined == name[0]) iterator = this.datasets.map((d) => d.name);
    iterator.map(async (key) => {
      if (this.datasets.map((d) => d.name).includes(key)) {
        let item = this.datasets.find((v) => v.name == key);
        item.data = await this.fetch(item.url, {
          method: item.method,
          data: item.param,
          wrap: item.wrap,
        });
        item.callbacks.forEach((cb) => {
          cb(item.data);
        });
      }
    });
    return this;
  }

  async add(
    url,
    options = {
      callback: function () {},
      name: null,
      method: "GET",
      data: {},
      wrap: false,
    }
  ) {
    let data = await this.fetch(url, options);
    const newDs = new this._datasetprop({
      name: options.name ?? url,
      url: url,
      data: data,
      method: options.method ?? "GET",
      param: options.data ?? {},
      wrap: options.wrap ?? false,
      callbacks: [],
    });
    if (options.callback) {
      console.log(newDs);
      newDs.callbacks.push(options.callback);
    }
    this.datasets.push(newDs);
  }
  async fetch(
    url,
    options = {
      method: "GET",
      data: {},
      wrap: false,
    }
  ) {
    return $.ajax({
      type: options.method ?? "GET",
      url: url,
      data: options.data ?? null,
      success: function (response) {
        return options.wrap ? response[options.wrap] : response;
      },
    });
  }
}
