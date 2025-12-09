import { ChangeEvent, FC, useCallback, useRef, useState } from "react";
import styles from "./Search.module.scss";
import debounce from "lodash.debounce";
import { useDispatch } from "react-redux";
import { setSearchValue } from "../../redux/filterSlice";

export const Search: FC = () => {
  const dispatch = useDispatch();
  const [value, setValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  // useCallback создаёт и возвращает мемоизированную функцию (чтобы она не пересоздавалась между рендерами)
  // useEffect выполняет (вызывает) переданную функцию после рендера компонента

  function onClickClear() {
    dispatch(setSearchValue(""));
    setValue("");
    // if (inputRef.current) {
    //   inputRef.current.focus();
    // }
    inputRef.current?.focus();
  }

  // будем вызывать эту функцию каждый раз при изменении инпута,
  // чтобы не было миллион запросов на сервер, а было кд
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateSearchValue = useCallback(
    debounce((str: string) => {
      dispatch(setSearchValue(str));
    }, 250),
    []
  );

  const onChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    updateSearchValue(event.target.value);
  };

  return (
    <div className={styles.root}>
      <svg
        className={styles.icon}
        xmlns="http://www.w3.org/2000/svg"
        enableBackground="new 0 0 50 50"
        height="50px"
        id="Layer_1"
        version="1.1"
        viewBox="0 0 50 50"
        width="50px"
      >
        <rect fill="none" height="50" width="50" />
        <circle
          cx="21"
          cy="20"
          fill="none"
          r="16"
          stroke="#000000"
          strokeLinecap="round"
          strokeMiterlimit="10"
          strokeWidth="2"
        />
        <line
          fill="none"
          stroke="#000000"
          strokeMiterlimit="10"
          strokeWidth="4"
          x1="32.229"
          x2="45.5"
          y1="32.229"
          y2="45.5"
        />
      </svg>
      <input
        ref={inputRef}
        value={value === undefined ? "" : value}
        className={styles.input}
        onChange={onChangeInput}
        placeholder="Поиск пиццы..."
      />
      {value && (
        <svg
          className={styles.clearIcon}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          height="24"
          viewBox="0 0 24 24"
          width="24"
          onClick={onClickClear}
        >
          <path
            d="M6.2253 4.81108C5.83477 4.42056 5.20161 4.42056 4.81108 4.81108C4.42056 5.20161 4.42056 5.83477 4.81108 6.2253L10.5858 12L4.81114 17.7747C4.42062 18.1652 4.42062 18.7984 4.81114 19.1889C5.20167 19.5794 5.83483 19.5794 6.22535 19.1889L12 13.4142L17.7747 19.1889C18.1652 19.5794 18.7984 19.5794 19.1889 19.1889C19.5794 18.7984 19.5794 18.1652 19.1889 17.7747L13.4142 12L19.189 6.2253C19.5795 5.83477 19.5795 5.20161 19.189 4.81108C18.7985 4.42056 18.1653 4.42056 17.7748 4.81108L12 10.5858L6.2253 4.81108Z"
            fill="currentColor"
          />
        </svg>
      )}
    </div>
  );
};
