<?php
     $response = array( 'success' => false );
     $formData = file_get_contents('php://input');
	 $input = json_decode($formData); //convert JSON into array
     $deliverTo = 'youremail@your-domain.com';

     if($input) {
         $name = $input->name;
         $email = $input->email;
		 $message = $input->message;

         $response[ 'data' ] = $input;
		
		 if ( $name != '' && $email != '' && $message != '') {
			
             // Send email
             $date = date('d/m/Y');
             $time = date('H:i:s');
	         
             $subject = 'Received request for estimate from: ' . $name;
             
	         $from = 'From: fakeemail@your-domain.com';
		     
		     $emailbody = 'You have recieved a free estimate request, from: ' . $name . ' on ' . $date . ' at ' . $time . "\r\n" .
                          'Name: ' . $name . "\r\n" .
		                  'Email: ' . $email . "\r\n" .
                          'Message: ' . $message;
		                  // . 'This message was sent from the IP Address: ' . $ipaddress . ' on ' . $date . ' at ' . $time;
		     
		      $success = mail($deliverTo, $subject, $emailbody, $from);
            
			  $response[ 'success' ] = $success;
	     }
     }

     echo json_encode( $response );
?>