App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load products.
    $.getJSON('../products.json', function(data) {
      var productsRow = $('#productsRow');
      var productTemplate = $('#productTemplate');

      for (i = 0; i < data.length; i ++) {
        productTemplate.find('.panel-title').text(data[i].name);
        productTemplate.find('img').attr('src', data[i].picture);
        productTemplate.find('.product-name').text(data[i].style);
        productTemplate.find('.product-version').text(data[i].version);
        productTemplate.find('.product-location').text(data[i].location);
        productTemplate.find('.btn-shop').attr('data-id', data[i].id);

        productsRow.append(productTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
		  // Modern dapp browsers...
	if (window.ethereum) {
	App.web3Provider = window.ethereum;
	try {
		// Request account access
		await window.ethereum.enable();
	} catch (error) {
		// User denied account access...
		console.error("User denied account access")
	  }
	}
	// Legacy dapp browsers...
	else if (window.web3) {
		App.web3Provider = window.web3.currentProvider;
	}	
	// If no injected web3 instance is detected, fall back to Ganache
	else {
		App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
	}
	web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
		$.getJSON('Shopping.json', function(data) {
	  // Get the necessary contract artifact file and instantiate it with truffle-contract
	  var ShoppingArtifact = data;
	  App.contracts.Shopping = TruffleContract(ShoppingArtifact);

	  // Set the provider for our contract
	  App.contracts.Shopping.setProvider(App.web3Provider);

	  // Use our contract to retrieve and mark the shopping of products
	  return App.markShopped();
	});

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-shop', App.handleShop);
  },

  markShopped: function(students, account) {
		var shoppingInstance;

	App.contracts.Shopping.deployed().then(function(instance) {
	  shoppingInstance = instance;

	  return shoppingInstance.getStudents.call();
	}).then(function(students) {
	  for (i = 0; i < students.length; i++) {
		if (students[i] !== '0x0000000000000000000000000000000000000000') {
		  $('.panel-products').eq(i).find('button').text('Success').attr('disabled', true);
		}
	  }
	}).catch(function(err) {
	  console.log(err.message);
	});
  },

  handleShop: function(event) {
    event.preventDefault();

    var productId = parseInt($(event.target).data('id'));

	var shoppingInstance;

	web3.eth.getAccounts(function(error, accounts) {
	if (error) {
		console.log(error);
	}

	var account = accounts[0];

	App.contracts.Shopping.deployed().then(function(instance) {
	shoppingInstance = instance;

	// Execute adopt as a transaction by sending account
	return shoppingInstance.shop(productId, {from: account});
	}).then(function(result) {
		return App.markShopped();
	  }).catch(function(err) {
		console.log(err.message);
	  });
	});
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
