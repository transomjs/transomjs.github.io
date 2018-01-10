module.exports = {
	note: "default api definition",
	name: "My App",
	administrator_email: "admin@foobar.com",
	transom: {},
	definition: {
		uri: {
			prefix: '/api/v2',
		},
		description: "My Transom test app",
		context: {
			contact_name: "",
			contact_email: "",
			contact_url: "",
			license_url: "",
			license_name: "",
			terms_of_service_url: ""
		},
		cors: {
			origins: ['http://localhost:8080'],
			exposeHeaders: ['foo']
		},
		template: {
			emailTemplatePath: 'my-email-templates',
			htmlTemplatePath: 'my-page-templates'
		},
		scaffold: {
			root: {
				path: '/',
				redirect: '/login'
			},
			assets: {
				static: true,
				assetPath: 'static-assets'
			},
			verify: {
				templateName: "AppUserVerify.body",
				data: {
					pageTitle: "Verify",
					appName: 'Transom Scaffold',
					verifyUrl: '/api/v2/user/verify'
				}
			},
			login: {
				templateName: "AppUserLogin.body",
				data: {
					pageTitle: "Login",
					appName: 'Transom Scaffold',
					loginUrl: '/api/v2/user/login'
				}
			},
			reset: {
				templateName: "AppUserReset.body",
				data: {
					pageTitle: "Reset",
					appName: 'Transom Scaffold',
					resetUrl: '/api/v2/user/reset'
				}
			},
			forgot: {
				templateName: "AppUserForgot.body",
				data: {
					pageTitle: "Forgot",
					appName: 'Transom Scaffold',
					forgotUrl: '/api/v2/user/forgot'
				}
			},
			address: {
				templateName: "Address.body",
				data: {
					pageTitle: "Address",
					appName: 'Transom Scaffold',
					signupUrl: '/api/v2/db/address'
				}
			},
			profile: {
				templateName: "AppUserMe.body",
				data: {
					pageTitle: "Profile",
					appName: 'Transom Scaffold'
				}
			},
			group: {
				templateName: "Group.body",
				data: {
					pageTitle: "Group",
					appName: 'Transom Scaffold',
					signupUrl: '/api/v2/db/group'
				}
			}
		},
		webhooks: {
			usedvic: {
				params: {
					description: "string"
				},
				headers: ["user-agent", "accept-language"],
				options: {
					protocol: "http:",
					hostname: "www.usedvictoria.com",
					path: "/classifieds/digital-film-cameras",
					method: "GET",
					headers: {
						'content-type': "application/x-www-form-urlencoded"
					},
					data: {
						pricefrom: 0,
						priceto: 500
					}
				}
			},
			github: {
				params: {
					q: "string"
				},
				headers: ["user-agent", "accept-language"],
				options: {
					protocol: "https:",
					hostname: "api.github.com",
					path: "/search/repositories",
					method: "GET",
					headers: {
						'content-type': "application/json; charset=utf-8",
						'user-agent': "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.59 Safari/537.36"
					},
					data: {
						sort: "stars",
						order: "desc"
					}
				}
			}
		},
		mongoose: {
			address: {
				acl: {
					create: ["public", "admin", "agents", "hillbilly"],
					default: {
						public: 2,
						owner: {
							CURRENT_USERID: 7
						}, // Defaults to: {"CURRENT_USER: 7}
						donotuse_group: {
							agents: 6
						}
					}
				},
				actions: {
					pre: {
						dummy: function (server, next) {
							console.log("This is a pre-dummy action!");
							next();
						},
						init: function (server, next) {
							console.log("This is a pre-init action!");
							next();
						},
						validate: function (server, next) {
							console.log("This is a pre-validate action!");
							next();
						},
						save: [
							function (server, next) {
								console.log("This is ONE pre-save action!");
								next();
							},
							function (server, next) {
								console.log("This is TWO pre-save action!");
								// console.log('pre this', this);
								this.address_line1 = this.address_line1.toUpperCase();
								next();
							},
							function (server, next) {
								console.log("This is THREE pre-save action!");
								next();
							}
						],
						remove: function (server, next) {
							console.log("This is a pre-remove action!");
							next();
						}
					},
					post: {
						init: function (server, item, next) {
							console.log("This is a post-init action!");
							next();
						},
						validate: function (server, item, next) {
							console.log("This is a post-validate action!");
							next();
						},
						save: function (server, item, next) {
							console.log("This is a post-save action!");
							// console.log('post item', item);
							// console.log('post this', this);

							next();
						},
						remove: function (server, item, next) {
							console.log("This is a post-remove action!");
							next();
						}
					}
				},
				attributes: {
					address_line1: {
						name: "Address Line 1",
						required: true,
						textsearch: 10,
						type: "string",
						default: "123 Default Street"
					},
					address_line2: {
						name: "Address Line 2",
						required: true,
						textsearch: 10,
						type: "string",
						default: "Apartment B3"
					},
					city: {
						name: "City"
					},
					country: "Country"
				}
			},
			person: {
				acl: {
					create: ["public", "admin", "agents", "hillbilly"],
					default: {
						public: 7,
						owner: {
							JamesBond: 4
						}, // Defaults to: {"CURRENT_USER: 7}
						group: {
							admin: 6
						}
					}
				},
				attributes: {
					lastname: {
						order: 200,
						csv: false
					},
					firstname: {
						name: "First Name",
						required: true,
						type: "string",
						order: 100,
						min: 2,
						max: 10
					},
					profile_pic: {
						name: "Profile Pic",
						type: "binary",
						max: 20480
					},
					last_visit: {
						type: "date",
						default: function () {
							return new Date();
						},
						order: 260
					},
					balance: {
						type: "number",
						required: true,
						default: function () {
							return new Date().getUTCMinutes();
						},
						min: 100,
						max: 9999,
						order: 200
					},
					billingaddress: {
						name: "Billing Address",
						required: false,
						type: "connector",
						connect_entity: "address"
					},
					shippingaddress: {
						name: "Shipping Address",
						required: false,
						connect_entity: "address",
						type: "connector"
					}
				}
			}
		},
		db_mongoose_queries: {
			richpeople: {
				name: "Rich People(>$1000)",
				object: "db_mongoose.person",
				query_string: "balance=>1000&_select=firstname,lastname,balance"
			}
		},
		notifications: "Coming Soon!",
		pubsub: "Coming Soon!",
		files: "Coming Soon!",
		security: {
			groups: [{
				name: "Foo",
				roles: ["address"]
			}],
			roles: {
				address: {
					object: "db_mongoose.address",
					privileges: "CRUD"
				}
			}
		}
	}
};
