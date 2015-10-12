<?php
namespace hawk_api\analitics;
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/hawk_api/php/hawk_api.php';

use \hawk_api\hawk_api;

class Сhat extends hawk_api
{
    /**
     * Конструктор. Инициалзирует объект апи
     */
    public function __construct($key)
    {
        parent::__construct($key);
    }

    /**
     * Точка входа
     */
    public function main()
    {
        $action = (string)$_POST['action'];

		switch ($action)
		{
			case 'register_user':
				$this->add_user();
				break;
			default:
				throw new \Exception('Unknow action');
		}
    }

    /**
     * Регистрирует пользвателя в сервисе и
     * добавляет его в группу
     * @return Boolean
     */
    private function add_user()
    {
        if(!$_POST['user_id'])
        {
            return false;
        }

        $this->register_user($_POST['user_id']);
		if($_POST['group_id'] && count($_POST['group_id']))
		{
			$this->add_user_to_group($_POST['user_id'], $_POST['group_id']);
		}
            
        $res = $this
			->execute()
            ->get_results();

		if($this->has_errors())
		{
			throw new \Exception(print_r($this->get_errors(), 1));
		}

		$res = $res[0]['register_user'];

        echo json_encode($res);
    }
}

$chat = new Сhat('Nflz2H7VcQ6Rve8lo3NDAKavZL+lSmUd5CuhhN585iHN4XsuTsE8O5N2U823egECQNWkVpFq45TLfCl1rALHhw==');
$chat->main();


