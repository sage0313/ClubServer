/* ticketdb_ddl */

CREATE TABLE `user` ( 
	`id`     bigint(20) AUTO_INCREMENT NOT NULL,
	`userid` varchar(128) NOT NULL,
	`userpwd`	varchar(128) NOT NULL,
	PRIMARY KEY(`id`)
);

CREATE TABLE `employee` ( 
	`id`     bigint(20) AUTO_INCREMENT NOT NULL,
	`sn` varchar(6) NOT NULL,
	`name`	varchar(50) NOT NULL,
	`phone`	varchar(13) NOT NULL,
	`part`	varchar(50) NOT NULL,
	`status` varchar(50) NOT NULL,
	PRIMARY KEY(`id`)
	, UNIQUE (`sn`)
);

CREATE TABLE `item` ( 
	`id`     bigint(20) AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`description`	varchar(500) NOT NULL,
	`type`	varchar(20) NOT NULL,
	PRIMARY KEY(`id`)
);

CREATE TABLE `cart` ( 
	`id`       bigint(20) NOT NULL,
	`empid`    	bigint(20) NOT NULL,
	`userid`   bigint(20) NOT NULL,
	`msg`      	varchar(1024) NULL,
	`timestamp`	timestamp NULL ,
	PRIMARY KEY(`id`)
);

ALTER TABLE `cart` ADD CONSTRAINT `cart_user_fk` 
	FOREIGN KEY(`userid`) REFERENCES `user`(`id`);

ALTER TABLE `cart` ADD CONSTRAINT `cart_emp_fk` 
	FOREIGN KEY(`empid`) REFERENCES `employee`(`id`);

CREATE TABLE item_in_cart ( 
	cartid     bigint(20) NOT NULL,
	itemid     bigint(20) NOT NULL,
	spent_count	bigint(20) NULL,
	spent_money	bigint(20) NULL,
	PRIMARY KEY (`cartid`, `itemid`)
	);

