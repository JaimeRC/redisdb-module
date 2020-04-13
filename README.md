# Redis DB

# Estructura del Proyecto

    docker-compose.yml                               # Crea la red, imagenes y contenedores (RedisDB y Test_commands)
        ├─── redis                                   # RedisDB
        |      └─── redis.conf                       # Archivo de configuracion de RedisDB
        └─── test_commands                           # Servicio para realizar Testing sobre RedisDB.
               ├─── test                             # Carpeta de Test
               |      ├─── connection.test.js        # Testing de la conexion.
               |      ├─── commands.test.js          # Testing sobre comandos basicos (get, set, call, getBuffer, exists, keys
               |      ├─── command.hash.test.js      # Archivos de Test
               └─── Dockerfile.js                    # Acciones sobre el contenedor

## Prerequisitos

- [Docker](https://docs.docker.com/install/) 
- [Docker Compose](https://docs.docker.com/compose/install/)

## Empezando

1. Clona el repositorio.
2. Ejecuta el comando `docker-compose up`.

        Creating network "mongo_network" with driver "bridge"
        Pulling mongo1 (redis:latest)...
        latest: Pulling from library/redis
        5bed26d33875: Downloading [=======>                                           ]  4.135MB/26.69MB
        ...
        1d3609ce2ac9: Waiting
        ...
        Starting redis ... done
        Starting test_commands ... done
        Attaching to redis, test_commands
        ...

3. Despues de que se creen las instancia en los contenedores, nos introduciremos dento del contenedor de `test_module` para ejecutar los test:
       
       docker exec -it test_module sh 
       npm run test
       
       RedisDB Testing
            Connection
              ✓ should emit connect when connected
              ✓ should emit close when disconnected
              ✓ should reject when connected
              ✓ should resolve when the status become ready
              ✓ should reject when closed (reconnecting)
              ✓ should reject when closed (end)
            Various Commands
              ✓ should support callback
              ✓ should support promise
              ✓ should keep the response order when mix using callback & promise
              ✓ should support get & set buffer
              ✓ should support get & set buffer via `call`
              ✓ should handle empty buffer
              ✓ should support utf8
              ✓ should consider null as empty str
              ✓ should support return int value
              ✓ should reject when disconnected
              ✓ should reject when enableOfflineQueue is disabled
              ✓ should support key prefixing
              ✓ should support key prefixing with multiple keys
              ✓ should allow sending the loading valid commands in connect event
              ✓ should reject loading invalid commands in connect event
            Hash commands
              ✓ should get the values ​​of each field
              ✓ should be considered null if the field or key does not exist
              ✓ should support key prefixing for sort
              ✓ should get the values ​​of each field (multi-get/multi-set)
              ✓ should be considered null if the field or key does not exist (multi-get/multi-set)
              ✓ should get all the values (multi-get/multi-set)
              ✓ should get the number of fields (multi-get/multi-set)
            Increment and Decrement Command (atomic)
              ✓ should get the increased value
              ✓ should get the decremented value
              ✓ should get the increased value by 5
              ✓ should get the decremented value by 5
              ✓ should get the increased value in hash
              ✓ should get the decremented value in hash
            Sets command
              ✓ should get a value one because the user does not exist
              ✓ should get a value zero because the user exists
              ✓ should get a value zero because the user exists
              ✓ should get the number of members
              ✓ should get all the members
              ✓ should get value one if user exists
              ✓ should get value zero if user does not exists
              ✓ should get value one if user has been deleted
              ✓ should get zero if the user has not been deleted
              ✓ should get the difference between sets
              ✓ should get intersection between sets
              ✓ should show all users in sets
            Request Limit Exercise
              ✓ should get permission because it does not exceed 10 requests
              ✓ should get permission because it does exceed 10 requests
            List commands
              ✓ should get a list with four elements adding to the beginning of the list
              ✓ should get a list with four elements adding to the end of the list
              ✓ should get different length of items from a list
              ✓ should get the size of a list
              ✓ should get the list without the elements repeated
              ✓ should return the first item in the list
              ✓ should check if the list exists or not
              ✓ should get a limited size list
            Sorted Sets commands
              ✓ should get an ordered set with its value
              ✓ should get an ordered set
              ✓ should override the value
              ✓ should get the size of the set
              ✓ should get the items within limits
              ✓ should get the increment value of an element and sort descending
              ✓ should get the value of each item
              ✓ should remove the first element
        
        
          65 passing (1s)



