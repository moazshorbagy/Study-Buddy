-- (user_login) By: Khaled Sameh
-- (user_status) By: Khaled Sameh
-- (user_info) By: Khaled Sameh
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

CREATE SCHEMA IF NOT EXISTS `studybuddy` DEFAULT CHARACTER SET latin1 ;
USE `studybuddy` ;

CREATE TABLE IF NOT EXISTS `studybuddy`.`User` (

  `user_id` 			INT NOT NULL AUTO_INCREMENT,

  `user_email`  		  VARCHAR(45) NOT NULL,

  `user_password` 		VARCHAR(300) NOT NULL,
  
  `user_name` 			  VARCHAR(150) NOT NULL,

  `user_join_date` 		TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,

  `user_phone`     		VARCHAR(15) NULL,

  `user_year`			    VARCHAR(10)	NULL,

  `user_department`		VARCHAR(5) NULL,
  
  `user_rate`           INT NULL DEFAULT 0,
  
  PRIMARY KEY (`user_id`),
  
  UNIQUE INDEX `user_email_UNIQUE` (`user_email` ASC))

ENGINE = InnoDB;


CREATE TABLE IF NOT EXISTS `studybuddy`.`Book` (

  `book_id` 			  INT		 	NOT NULL AUTO_INCREMENT,
  
  `book_post_date`		TIMESTAMP 	NULL DEFAULT CURRENT_TIMESTAMP,

  `book_status` 		VARCHAR(70) NOT NULL,

  `book_code`   		VARCHAR(10) NOT NULL,

  `book_author` 		VARCHAR(100) NOT NULL,

  `book_title`  		VARCHAR(150) NOT NULL,

  `book_edition`		INT			NOT NULL,

  `book_duration`		INT			NOT NULL,  	  /* IN DAYS, how long the donor decided to lend his book*/

  `owner_id`			INT			NULL,  

  `donor_id`			INT			NOT NULL,

  PRIMARY KEY (`book_id`),

        FOREIGN KEY (`owner_ID`)
    REFERENCES `studybuddy`.`User` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
        
        FOREIGN KEY (`donor_ID`)
    REFERENCES `studybuddy`.`User` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
	
    )
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `studybuddy`.`Tool` (
  
  `tool_id` 			    INT		 	NOT NULL AUTO_INCREMENT,
  
  `tool_post_date`		TIMESTAMP 	NULL DEFAULT CURRENT_TIMESTAMP,
  
  `tool_status` 		  VARCHAR(70) NOT NULL,
  
  `type`		   		    VARCHAR(30) NOT NULL,
  
  `manufacturer` 		  VARCHAR(50) NOT NULL,
  
  `tool_duration`		  INT			NOT NULL,     /* IN DAYS*/
  
  `owner_id`			    INT			NULL,
  
  `donor_id`			    INT			NOT NULL,
  
  PRIMARY KEY (`tool_id`),
         
		FOREIGN KEY (`owner_id`)
    REFERENCES `studybuddy`.`User` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
        
        FOREIGN KEY (`donor_id`)
    REFERENCES `studybuddy`.`User` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)

ENGINE = InnoDB;



CREATE TABLE IF NOT EXISTS `studybuddy`.`Requested_Book` (

  `book_id`        INT NOT NULL AUTO_INCREMENT,
  
  `user_id` 			  INT NOT NULL,
  
  `create_date`	   	TIMESTAMP 	NULL DEFAULT CURRENT_TIMESTAMP,

  `book_author` 		VARCHAR(100) NOT NULL,

  `book_title`  		VARCHAR(150) NOT NULL,

  `book_edition`		INT			NOT NULL,
  
  PRIMARY KEY (`book_id`),
         
	FOREIGN KEY (`user_id`)
    REFERENCES `studybuddy`.`User` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,

  FOREIGN KEY (`book_id`)
    REFERENCES `studybuddy`.`Book` (`book_id`)
    
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)

ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `studybuddy`.`Requested_Item` (

  `item_id`         INT NOT NULL AUTO_INCREMENT,
  
  `user_id` 			  INT NOT NULL,
  
  `create_date`	   	TIMESTAMP 	NULL DEFAULT CURRENT_TIMESTAMP,

  `type`		   		  VARCHAR(30) NOT NULL,
  
  `manufacturer` 		VARCHAR(50) NOT NULL,
  
  PRIMARY KEY (`item_id`),
         
	FOREIGN KEY (`user_id`)
    REFERENCES `studybuddy`.`User` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
   )

ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `studybuddy`.`User_Rating`(

  `user_id`                 INT NOT NULL,
  
  `rating_user`             INT NOT NULL,

  `rating`                  INT NOT NULL,
  
  Primary Key (`user_id`, `rating_user`)

)
ENGINE = InnoDB;


CREATE TABLE IF NOT EXISTS `studybuddy`.`Request`(

  `type`                    VARCHAR(100) NOT NULL,
  
  `item_id`                 INT NOT NULL,
  
  `donor_id`                INT NOT NULL,
  
  `user_id`                 INT NOT NULL,
  
  Primary Key (`type`,`item_id`,`donor_id`,`user_id`)

)
ENGINE = InnoDB;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;