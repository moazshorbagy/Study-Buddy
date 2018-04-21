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

  `user_email`  		VARCHAR(45) NOT NULL,

  `user_password` 		VARCHAR(300) NOT NULL,
  
  `user_name` 			VARCHAR(70) NOT NULL,

  `user_join_date` 		TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,

  `user_phone`     		VARCHAR(15) NULL,

  `user_year`			INT	NULL,

  `user_department`		VARCHAR(5) NULL,
  
  PRIMARY KEY (`user_id`),
  
  UNIQUE INDEX `user_email_UNIQUE` (`user_email` ASC))

ENGINE = InnoDB;


CREATE TABLE IF NOT EXISTS `studybuddy`.`Book` (

  `book_id` 			INT		 	NOT NULL AUTO_INCREMENT,
  
  `book_post_date`		TIMESTAMP 	NULL DEFAULT CURRENT_TIMESTAMP,

  `book_status` 		VARCHAR(70) NOT NULL,

  `book_code`   		VARCHAR(10) NOT NULL,

  `book_author` 		VARCHAR(100) NOT NULL,

  `book_title`  		VARCHAR(150) NOT NULL,

  `book_edition`		INT			NOT NULL,

  `book_duration`		INT			NOT NULL,  	  /* IN DAYS, how long the doner decided to lend his book*/

  `book_owning_duration`INT			NULL,	  	  /*Same....  for how long the owner(not doner) has the book*/

  `owner_ID`			INT			NULL,  

  `donor_ID`			INT			NOT NULL,

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
  
  `tool_ID` 			INT		 	NOT NULL AUTO_INCREMENT,
  
  `tool_status` 		VARCHAR(70) NOT NULL,
  
  `type`		   		VARCHAR(20) NOT NULL,
  
  `manufacturer` 		VARCHAR(25) NOT NULL,
  
  `tool_duration`		INT			NOT NULL,     /* IN DAYS*/
  
  `tool_owning_duration`INT			NULL,	  	  /*Same....*/
  
  `owner_ID`			INT			NULL,
  
  `doner_ID`			INT			NOT NULL,
  
  PRIMARY KEY (`tool_ID`),
         
		FOREIGN KEY (`owner_ID`)
    REFERENCES `studybuddy`.`User` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
        
        FOREIGN KEY (`doner_ID`)
    REFERENCES `studybuddy`.`User` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)

ENGINE = InnoDB;



CREATE TABLE IF NOT EXISTS `studybuddy`.`Requested_Item` (
  
  `Request_No` 			INT NOT NULL,
  
  `user_ID` 			INT NOT NULL,
  
  `create_date`	   		DATE NOT NULL,
  
  PRIMARY KEY (`Request_No`,`user_ID`),
         
	FOREIGN KEY (`user_ID`)
    REFERENCES `studybuddy`.`User` (`user_id`)
    
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)

ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `studybuddy`.`Request`(
  
  `BookID`                INT NOT NULL,
  
  `DonorID`				  INT NOT NULL,
  
  `UserID`				  INT NOT NULL,
  
  Primary Key (`BookID`,`DonorID`,`OwnerID`),
  
	FOREIGN KEY(`BookID`)
    REFERENCES `studybuddy`.`book`(`book_id`),
    
    FOREIGN KEY(`DonorID`)
    REFERENCES `studybuddy`.`book`(`donor_ID`),
    
    FOREIGN KEY (`UserID`)
    REFERENCES `studybuddy`.`User`(`user_id`)
    
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
  
  
)
ENGINE = InnoDB;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;