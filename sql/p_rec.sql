delimiter $$
drop procedure if exists p_rec;
create procedure p_rec(in level int, out result char(10))

	begin

	    declare n int default 0;
        declare i int default 0;
        declare c int default 0;


        set i = level;
        set result = " ";
        set n = 3;

            while n != 0 do

                set i = f_rec(i);
                set result = concat(result, i);
                set n = n - 1;

            end while;   
	  
    

    end;
 $$

 delimiter ;