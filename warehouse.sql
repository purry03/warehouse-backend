--
-- PostgreSQL database dump
--

-- Dumped from database version 14.2
-- Dumped by pg_dump version 14.2

-- Started on 2022-06-11 10:30:19

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 835 (class 1247 OID 16406)
-- Name: valid_types; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.valid_types AS ENUM (
    'seller',
    'buyer'
);


ALTER TYPE public.valid_types OWNER TO postgres;

--
-- TOC entry 219 (class 1255 OID 16608)
-- Name: log_listing_add(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.log_listing_add() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
	INSERT INTO audit(database_name,event_type,object_name,event_date) VALUES('listings','create',NEW.title,now());
	RETURN NEW;
END;
$$;


ALTER FUNCTION public.log_listing_add() OWNER TO postgres;

--
-- TOC entry 222 (class 1255 OID 16609)
-- Name: log_listing_delete(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.log_listing_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
	INSERT INTO audit(database_name,event_type,object_name,event_date) VALUES('listings','delete',OLD.title,now());
	RETURN OLD;
END;
$$;


ALTER FUNCTION public.log_listing_delete() OWNER TO postgres;

--
-- TOC entry 220 (class 1255 OID 16615)
-- Name: log_prebooking_add(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.log_prebooking_add() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
	INSERT INTO audit(database_name,event_type,object_name,event_date) VALUES('prebooking','create',NEW.prebooking_number,now());
	RETURN NEW;
END;
$$;


ALTER FUNCTION public.log_prebooking_add() OWNER TO postgres;

--
-- TOC entry 221 (class 1255 OID 16620)
-- Name: log_prebooking_delete(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.log_prebooking_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
	INSERT INTO audit(database_name,event_type,object_name,event_date) VALUES('prebookings','delete',OLD.prebooking_number,now());
	RETURN OLD;
END;
$$;


ALTER FUNCTION public.log_prebooking_delete() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 218 (class 1259 OID 16601)
-- Name: audit; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit (
    id integer NOT NULL,
    database_name character varying NOT NULL,
    event_type character varying NOT NULL,
    object_name character varying,
    event_date timestamp without time zone NOT NULL
);


ALTER TABLE public.audit OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16600)
-- Name: audit_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.audit_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.audit_id_seq OWNER TO postgres;

--
-- TOC entry 3374 (class 0 OID 0)
-- Dependencies: 217
-- Name: audit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.audit_id_seq OWNED BY public.audit.id;


--
-- TOC entry 214 (class 1259 OID 16530)
-- Name: listings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.listings (
    listing_id integer NOT NULL,
    user_id integer NOT NULL,
    img character varying(255),
    title character varying(255) NOT NULL,
    description character varying(2000) NOT NULL,
    inventory integer NOT NULL,
    price integer NOT NULL
);


ALTER TABLE public.listings OWNER TO postgres;

--
-- TOC entry 213 (class 1259 OID 16529)
-- Name: listings_listing_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.listings_listing_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.listings_listing_id_seq OWNER TO postgres;

--
-- TOC entry 3375 (class 0 OID 0)
-- Dependencies: 213
-- Name: listings_listing_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.listings_listing_id_seq OWNED BY public.listings.listing_id;


--
-- TOC entry 216 (class 1259 OID 16582)
-- Name: prebookings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.prebookings (
    prebooking_id integer NOT NULL,
    prebooking_number character varying(14) NOT NULL,
    listing_id integer NOT NULL,
    user_id integer NOT NULL,
    quantity integer NOT NULL,
    created_at timestamp without time zone NOT NULL
);


ALTER TABLE public.prebookings OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16581)
-- Name: prebookings_prebooking_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.prebookings_prebooking_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.prebookings_prebooking_id_seq OWNER TO postgres;

--
-- TOC entry 3376 (class 0 OID 0)
-- Dependencies: 215
-- Name: prebookings_prebooking_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.prebookings_prebooking_id_seq OWNED BY public.prebookings.prebooking_id;


--
-- TOC entry 212 (class 1259 OID 16516)
-- Name: tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tokens (
    token_id integer NOT NULL,
    user_id integer,
    refresh_token character varying(255) NOT NULL,
    created_at timestamp without time zone NOT NULL
);


ALTER TABLE public.tokens OWNER TO postgres;

--
-- TOC entry 211 (class 1259 OID 16515)
-- Name: tokens_token_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tokens_token_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tokens_token_id_seq OWNER TO postgres;

--
-- TOC entry 3377 (class 0 OID 0)
-- Dependencies: 211
-- Name: tokens_token_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tokens_token_id_seq OWNED BY public.tokens.token_id;


--
-- TOC entry 210 (class 1259 OID 16507)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(64) NOT NULL,
    type public.valid_types NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 209 (class 1259 OID 16506)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_user_id_seq OWNER TO postgres;

--
-- TOC entry 3378 (class 0 OID 0)
-- Dependencies: 209
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- TOC entry 3195 (class 2604 OID 16604)
-- Name: audit id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit ALTER COLUMN id SET DEFAULT nextval('public.audit_id_seq'::regclass);


--
-- TOC entry 3193 (class 2604 OID 16533)
-- Name: listings listing_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.listings ALTER COLUMN listing_id SET DEFAULT nextval('public.listings_listing_id_seq'::regclass);


--
-- TOC entry 3194 (class 2604 OID 16585)
-- Name: prebookings prebooking_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prebookings ALTER COLUMN prebooking_id SET DEFAULT nextval('public.prebookings_prebooking_id_seq'::regclass);


--
-- TOC entry 3192 (class 2604 OID 16519)
-- Name: tokens token_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tokens ALTER COLUMN token_id SET DEFAULT nextval('public.tokens_token_id_seq'::regclass);


--
-- TOC entry 3191 (class 2604 OID 16510)
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- TOC entry 3368 (class 0 OID 16601)
-- Dependencies: 218
-- Data for Name: audit; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit (id, database_name, event_type, object_name, event_date) FROM stdin;
28	prebooking	create	A27F-E3F2-357C	2022-05-04 10:10:16.834092
30	prebookings	delete	BD32-AE0F-FDE4	2022-05-04 10:11:38.027376
31	prebookings	delete	A27F-E3F2-357C	2022-05-04 10:11:58.189998
32	prebooking	create	4E3A-27A6-6915	2022-05-04 10:13:11.618288
33	prebooking	create	2333-1737-B66A	2022-05-04 10:13:11.96636
34	prebooking	create	CE3F-4BCA-208E	2022-05-04 10:13:12.605252
35	prebooking	create	BDEA-D4FE-A8EF	2022-05-04 10:13:13.313863
36	prebooking	create	6069-9F32-2010	2022-05-04 10:13:13.904045
37	prebooking	create	A386-BE39-9721	2022-05-04 10:13:14.478666
38	listings	delete	Decorative Stand	2022-05-04 10:13:54.814862
39	listings	delete	Decorative Stand	2022-05-04 10:13:54.814862
40	listings	delete	Decorative Stand	2022-05-04 10:13:54.814862
41	listings	delete	Decorative Stand	2022-05-04 10:13:54.814862
42	listings	delete	Decorative Stand	2022-05-04 10:13:54.814862
43	prebookings	delete	4E3A-27A6-6915	2022-05-04 10:13:54.814862
44	prebookings	delete	2333-1737-B66A	2022-05-04 10:13:54.814862
45	prebookings	delete	CE3F-4BCA-208E	2022-05-04 10:13:54.814862
46	prebookings	delete	BDEA-D4FE-A8EF	2022-05-04 10:13:54.814862
47	prebookings	delete	6069-9F32-2010	2022-05-04 10:13:54.814862
48	prebookings	delete	A386-BE39-9721	2022-05-04 10:13:54.814862
49	listings	create	Product 1	2022-05-04 11:17:21.008323
50	prebooking	create	51B6-A308-47B8	2022-05-04 11:18:40.586891
57	listings	create	Product 2	2022-05-09 15:26:53.706883
58	listings	create	Product 3\n	2022-05-10 00:16:36.13619
59	listings	create	Product 4	2022-05-10 00:16:36.13619
60	listings	create	Product 5	2022-05-10 00:16:36.13619
61	listings	create	Product 6	2022-05-10 00:16:36.13619
62	prebooking	create	8D57-A23C-0C7A	2022-05-13 00:31:37.190572
63	prebooking	create	C013-2A4E-652A	2022-05-13 00:31:47.066359
64	prebooking	create	EE41-0688-DE8D	2022-05-13 00:31:47.514361
65	prebooking	create	768B-98E4-9C49	2022-05-13 00:31:47.685455
66	prebooking	create	4E2B-B60B-D7EF	2022-05-13 00:31:47.837768
67	prebooking	create	5313-CEBE-E984	2022-05-13 00:36:49.223536
68	prebooking	create	BE36-B7D4-1DB3	2022-05-13 00:37:48.093814
69	prebooking	create	159A-C332-0078	2022-05-13 00:38:05.245109
70	prebooking	create	5DCD-07CA-9BFA	2022-05-13 00:38:05.556133
71	prebooking	create	7034-ECAE-76BD	2022-05-13 00:38:10.472277
72	prebooking	create	6EDA-165B-6BBB	2022-05-13 00:40:08.653718
73	prebooking	create	661E-ED18-4A8A	2022-05-13 00:40:18.08706
74	prebooking	create	46F1-4E90-9740	2022-05-13 00:40:18.985122
75	prebooking	create	FE49-6CB1-75D3	2022-05-13 00:40:20.243011
76	prebooking	create	D953-01CD-B222	2022-05-13 00:40:20.941221
77	prebooking	create	4A0B-D22E-9119	2022-05-13 00:40:21.107681
78	prebooking	create	C7FB-4651-C198	2022-05-13 00:40:21.447763
79	prebooking	create	59B0-11D4-ED42	2022-05-13 00:40:21.62878
80	prebooking	create	1609-5259-7593	2022-05-13 00:40:21.832253
81	prebooking	create	165A-6905-D2CE	2022-05-13 00:40:22.017462
82	prebooking	create	D4E4-9693-A2B6	2022-05-13 00:40:22.584671
83	prebooking	create	508C-2AD0-7512	2022-05-13 00:40:36.301722
84	prebooking	create	2C1A-CAEF-B152	2022-05-13 00:40:37.393213
85	prebooking	create	2D7F-192C-A89F	2022-05-13 00:40:40.802162
86	prebooking	create	8506-7C66-FE91	2022-05-13 00:40:41.234109
87	prebooking	create	C595-4155-1533	2022-05-13 00:40:41.411933
88	prebooking	create	F404-3005-6769	2022-05-13 00:40:41.569137
89	prebooking	create	E104-F4C7-9B61	2022-05-13 00:40:41.719667
90	prebooking	create	9486-3A35-6602	2022-05-13 00:40:41.880653
91	prebooking	create	E732-D5B8-1132	2022-05-13 00:40:42.042313
92	prebooking	create	A630-A96F-842C	2022-05-13 00:40:42.208986
93	prebooking	create	9CBC-445A-A762	2022-05-13 00:40:42.386566
94	prebooking	create	3B4C-AC4C-DF17	2022-05-13 00:40:42.941275
95	prebooking	create	C957-BE0A-D295	2022-05-13 00:40:43.099635
96	prebooking	create	2641-5E59-5E02	2022-05-13 00:40:50.678879
97	prebooking	create	ADDB-7A32-FB97	2022-05-13 00:40:50.86544
98	prebooking	create	E657-6A0D-8A36	2022-05-13 00:40:51.032431
99	prebooking	create	4314-51ED-E45E	2022-05-13 00:40:51.197991
100	prebooking	create	EEFB-7BCC-E2CA	2022-05-13 00:40:51.50426
101	prebooking	create	A21A-B80E-8791	2022-05-13 00:40:51.699096
102	prebooking	create	D00B-6820-B03C	2022-05-13 00:40:51.856196
103	prebooking	create	B9A6-3FCF-F7E4	2022-05-13 00:40:52.023274
104	prebooking	create	54B3-56CE-8CA5	2022-05-13 00:40:52.452391
105	prebooking	create	BB27-4F04-EB1C	2022-05-13 22:48:22.190253
106	prebooking	create	79B6-C3BF-4607	2022-05-13 22:48:26.150637
107	prebooking	create	C0AA-A1F7-7095	2022-05-13 22:53:32.339688
108	prebooking	create	A7E2-E2A3-093D	2022-05-13 23:11:37.583217
109	prebooking	create	F527-FF89-71C9	2022-05-13 23:24:10.979526
110	prebooking	create	186B-C43B-090F	2022-05-13 23:28:25.634113
111	prebooking	create	F6FB-B126-7C3F	2022-05-13 23:30:22.116677
112	prebooking	create	2CD0-B1D8-F55C	2022-05-13 23:34:12.622962
113	prebooking	create	40FA-5001-53E7	2022-05-13 23:43:30.167838
114	listings	delete	Product 2	2022-05-17 16:12:02.89645
115	prebookings	delete	BE36-B7D4-1DB3	2022-05-17 16:12:02.89645
116	prebookings	delete	159A-C332-0078	2022-05-17 16:12:02.89645
117	prebookings	delete	5DCD-07CA-9BFA	2022-05-17 16:12:02.89645
118	prebookings	delete	7034-ECAE-76BD	2022-05-17 16:12:02.89645
119	prebookings	delete	6EDA-165B-6BBB	2022-05-17 16:12:02.89645
120	listings	delete	Product 1	2022-05-17 16:12:06.447041
121	prebookings	delete	51B6-A308-47B8	2022-05-17 16:12:06.447041
122	prebookings	delete	661E-ED18-4A8A	2022-05-17 16:12:06.447041
123	prebookings	delete	46F1-4E90-9740	2022-05-17 16:12:06.447041
124	prebookings	delete	FE49-6CB1-75D3	2022-05-17 16:12:06.447041
125	prebookings	delete	D953-01CD-B222	2022-05-17 16:12:06.447041
126	prebookings	delete	4A0B-D22E-9119	2022-05-17 16:12:06.447041
127	prebookings	delete	C7FB-4651-C198	2022-05-17 16:12:06.447041
128	prebookings	delete	59B0-11D4-ED42	2022-05-17 16:12:06.447041
129	prebookings	delete	1609-5259-7593	2022-05-17 16:12:06.447041
130	prebookings	delete	165A-6905-D2CE	2022-05-17 16:12:06.447041
131	prebookings	delete	D4E4-9693-A2B6	2022-05-17 16:12:06.447041
132	prebookings	delete	508C-2AD0-7512	2022-05-17 16:12:06.447041
133	prebookings	delete	2C1A-CAEF-B152	2022-05-17 16:12:06.447041
134	prebookings	delete	2D7F-192C-A89F	2022-05-17 16:12:06.447041
135	prebookings	delete	8506-7C66-FE91	2022-05-17 16:12:06.447041
136	prebookings	delete	C595-4155-1533	2022-05-17 16:12:06.447041
137	prebookings	delete	F404-3005-6769	2022-05-17 16:12:06.447041
138	prebookings	delete	E104-F4C7-9B61	2022-05-17 16:12:06.447041
139	prebookings	delete	9486-3A35-6602	2022-05-17 16:12:06.447041
140	prebookings	delete	E732-D5B8-1132	2022-05-17 16:12:06.447041
141	prebookings	delete	A630-A96F-842C	2022-05-17 16:12:06.447041
142	prebookings	delete	9CBC-445A-A762	2022-05-17 16:12:06.447041
143	prebookings	delete	3B4C-AC4C-DF17	2022-05-17 16:12:06.447041
144	prebookings	delete	C957-BE0A-D295	2022-05-17 16:12:06.447041
145	prebookings	delete	2641-5E59-5E02	2022-05-17 16:12:06.447041
146	prebookings	delete	ADDB-7A32-FB97	2022-05-17 16:12:06.447041
147	prebookings	delete	E657-6A0D-8A36	2022-05-17 16:12:06.447041
148	prebookings	delete	4314-51ED-E45E	2022-05-17 16:12:06.447041
149	prebookings	delete	EEFB-7BCC-E2CA	2022-05-17 16:12:06.447041
150	prebookings	delete	A21A-B80E-8791	2022-05-17 16:12:06.447041
151	prebookings	delete	D00B-6820-B03C	2022-05-17 16:12:06.447041
152	prebookings	delete	B9A6-3FCF-F7E4	2022-05-17 16:12:06.447041
153	prebookings	delete	54B3-56CE-8CA5	2022-05-17 16:12:06.447041
154	prebookings	delete	F527-FF89-71C9	2022-05-17 16:12:06.447041
155	prebookings	delete	186B-C43B-090F	2022-05-17 16:12:06.447041
156	prebookings	delete	F6FB-B126-7C3F	2022-05-17 16:12:06.447041
157	prebookings	delete	2CD0-B1D8-F55C	2022-05-17 16:12:06.447041
158	listings	delete	Product 5	2022-05-17 16:12:07.678431
159	listings	delete	Product 4	2022-05-17 16:12:08.789036
160	listings	delete	Product 6	2022-05-17 16:12:09.726788
161	listings	create	Product 1\n	2022-05-17 16:14:35.704981
162	listings	create	Product 2	2022-05-17 16:14:35.704981
163	listings	create	Product 4\n\n	2022-05-17 16:14:35.704981
164	listings	create	Product 5\n	2022-05-17 16:14:35.704981
165	listings	delete	Product 5\n	2022-05-17 16:14:47.518278
166	listings	delete	Product 3\n	2022-05-17 16:14:53.148932
167	prebookings	delete	8D57-A23C-0C7A	2022-05-17 16:14:53.148932
168	prebookings	delete	C013-2A4E-652A	2022-05-17 16:14:53.148932
169	prebookings	delete	EE41-0688-DE8D	2022-05-17 16:14:53.148932
170	prebookings	delete	768B-98E4-9C49	2022-05-17 16:14:53.148932
171	prebookings	delete	4E2B-B60B-D7EF	2022-05-17 16:14:53.148932
172	prebookings	delete	5313-CEBE-E984	2022-05-17 16:14:53.148932
173	prebookings	delete	BB27-4F04-EB1C	2022-05-17 16:14:53.148932
174	prebookings	delete	79B6-C3BF-4607	2022-05-17 16:14:53.148932
175	prebookings	delete	C0AA-A1F7-7095	2022-05-17 16:14:53.148932
176	prebookings	delete	A7E2-E2A3-093D	2022-05-17 16:14:53.148932
177	prebookings	delete	40FA-5001-53E7	2022-05-17 16:14:53.148932
178	listings	delete	Product 4\n\n	2022-05-17 16:14:53.524677
179	listings	delete	Product 1\n	2022-05-17 16:14:54.094329
180	listings	delete	Product 2	2022-05-17 16:15:49.970337
181	listings	create	q	2022-05-17 16:42:37.218631
182	listings	create	q	2022-05-17 16:42:42.164258
183	listings	delete	q	2022-05-17 16:43:08.956253
184	listings	delete	q	2022-05-17 16:43:09.329562
185	listings	create	Worms	2022-05-17 16:43:52.627464
186	listings	create	Landscape	2022-05-17 16:44:30.567747
187	listings	create	Stars	2022-05-17 16:45:40.439218
188	listings	create	test	2022-05-17 16:46:43.162265
189	listings	delete	test	2022-05-17 16:47:10.827652
190	listings	create	Mountains	2022-05-17 16:48:09.160481
191	prebooking	create	E489-ECFA-FC69	2022-05-17 16:48:36.747516
192	prebooking	create	7AD9-BDC7-8DD5	2022-05-17 19:06:57.865277
193	listings	delete	Stars	2022-05-17 19:07:55.513475
194	prebookings	delete	7AD9-BDC7-8DD5	2022-05-17 19:07:55.513475
195	listings	create	Stars	2022-05-17 19:09:30.785102
196	prebookings	delete	E489-ECFA-FC69	2022-05-20 15:55:27.314396
197	prebooking	create	7A41-A600-0055	2022-05-20 15:56:05.338314
198	prebooking	create	BE19-46EE-6CF9	2022-05-20 15:56:32.157894
199	prebookings	delete	BE19-46EE-6CF9	2022-05-20 15:56:50.918867
200	prebookings	delete	7A41-A600-0055	2022-05-20 15:57:01.087719
201	listings	create	Clock	2022-05-20 16:29:17.55985
202	prebooking	create	BDD1-094B-868F	2022-05-20 18:46:59.206921
203	listings	delete	Stars	2022-05-25 14:38:39.544455
204	prebooking	create	12D7-A46D-5950	2022-05-25 17:00:23.287559
205	prebookings	delete	12D7-A46D-5950	2022-05-25 17:01:01.586765
206	prebooking	create	EB19-5811-326B	2022-05-27 20:00:36.535885
207	prebooking	create	7723-4B88-609B	2022-05-27 20:01:55.401102
208	prebooking	create	9A48-D6C0-337B	2022-06-07 16:02:06.559569
209	prebooking	create	FEAF-BD29-9842	2022-06-07 16:02:19.46794
210	prebooking	create	C7ED-5DA2-942D	2022-06-07 16:31:06.08362
211	prebooking	create	90E0-22FF-C7DD	2022-06-07 16:45:03.670181
212	prebooking	create	1F57-0FBE-F9F8	2022-06-07 17:04:04.173417
213	listings	create	Oil Painting	2022-06-07 17:04:35.07744
\.


--
-- TOC entry 3364 (class 0 OID 16530)
-- Dependencies: 214
-- Data for Name: listings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.listings (listing_id, user_id, img, title, description, inventory, price) FROM stdin;
28	8	981da08a49980b23e9e0654bb7260ffe.jpeg	Landscape	Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.	8	75000
27	8	54afbe092adb2126669687a4e782fc6a.png	Worms	Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.	2	45000
33	8	610a1f4463c3a221acb3628931e38cfd.jpeg	Clock	Curabitur eros libero, convallis eu aliquam ac, tincidunt quis ex. Aliquam ullamcorper, leo eget accumsan mattis, nisi massa tempor libero, commodo aliquet neque felis in ante. Duis pellentesque nisl eu vehicula auctor. Nullam et dolor in magna iaculis congue. Nunc consequat augue eget purus vulputate consequat. Sed eleifend laoreet porttitor. Proin lobortis sapien ut vehicula congue. Sed scelerisque feugiat tincidunt.	5	15000
31	8	e19f83c81efa63248d59c961c447241b.jpeg	Mountains	Vestibulum blandit arcu non tempus dictum. Donec fermentum sapien at lorem sodales, id gravida ligula blandit. Fusce iaculis, elit at tincidunt dignissim, mauris mi lacinia mi, sed convallis nisl urna a elit. Ut et tellus ut ex semper suscipit. Phasellus hendrerit purus id convallis imperdiet. In tincidunt diam eget magna vestibulum maximus. Nulla at interdum mi. Maecenas vitae ex non ligula molestie laoreet. Nulla finibus ac nibh quis cursus. Mauris sollicitudin elit at nibh ultricies, eget volutpat purus ullamcorper.	19	15000
34	8	a99521c4291be16d05feb941773cf6b9.jpeg	Oil Painting	An Oil painting	10	25000
\.


--
-- TOC entry 3366 (class 0 OID 16582)
-- Dependencies: 216
-- Data for Name: prebookings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.prebookings (prebooking_id, prebooking_number, listing_id, user_id, quantity, created_at) FROM stdin;
105	BDD1-094B-868F	27	19	1	2022-05-20 18:46:59.216
107	EB19-5811-326B	33	9	1	2022-05-27 20:00:36.533
108	7723-4B88-609B	27	19	2	2022-05-27 20:01:55.398
109	9A48-D6C0-337B	33	9	1	2022-06-07 16:02:06.567
110	FEAF-BD29-9842	33	9	1	2022-06-07 16:02:19.472
111	C7ED-5DA2-942D	33	9	1	2022-06-07 16:31:06.091
112	90E0-22FF-C7DD	33	9	1	2022-06-07 16:45:03.67
113	1F57-0FBE-F9F8	31	9	1	2022-06-07 17:04:04.174
\.


--
-- TOC entry 3362 (class 0 OID 16516)
-- Dependencies: 212
-- Data for Name: tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tokens (token_id, user_id, refresh_token, created_at) FROM stdin;
61	16	6fbde3bd5663afc3dc998b8e49ca215a9ac00a97da78fbd392f50989e55597b3	2022-05-04 11:15:17.803
35	8	2e1d740c64ccd5abda3f9d9c79f97df93edc148162547d41dff72570c2c5362b	2022-05-04 11:15:48.465
36	9	bfe786fb2b6701a43bb79c0bc58d9fa0784f335cc6e780897222f7689780e11d	2022-05-04 12:46:58.528
41	13	9a28bfd92ac6c13aa1ec581babb7b9337379863bb57be0954a4b9a0a4948b0a9	2022-05-03 18:02:32.921
\.


--
-- TOC entry 3360 (class 0 OID 16507)
-- Dependencies: 210
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, username, password, type) FROM stdin;
8	seller1	$2b$10$LJ2bH40t1PzYx5Eo54mg.uFTc.u/upakEGBLP4E1vnj7mCPlxdgJ6	seller
9	buyer1	$2b$10$b0rnRLqXMnCuXebCaNucIeHSCP7ngqZKRRCtwzF.Rp0jd4KS8Xk0C	buyer
13	buyer2	$2b$10$ib66kPEuiQTHoGCBNHAX0e4WKk69iGetc9UHJ4gk0zRBf5qmt45n6	buyer
16	shreyaskar	$2b$10$rSQ99AVDWmvzzoBbQH54geX51ec42z7lPbNYZnyDOu.Hkq6vxkJ4i	buyer
17	perry1715	$2b$10$bSIcyP1YtkhAqcDxagJD6O0vtIrR3NWRSfDp9tWbFUos5nkaoUFqG	buyer
18	lol	$2b$10$rByAjiUiRVUwOYtM7SAYyuwZhlmh3V2cIOOSmHJ0is2QdwO.4lZsq	seller
19	Rohan	$2b$10$xW2QtSSlj35p415QZYll2.Kb7plHZbM2cqrflEYvX4Kd5E/55ACi2	buyer
20	Rohan1	$2b$10$O0mnMzs5UY6ggHU3Tw9PCe18n6IK5dB9.FgYNJKObNZ.L/6b3hY8O	seller
21	Rohan2	$2b$10$SCEpZKmP5.BhhfiOj138t.SlI86tJHlAjJkA7hzNUbzfEBjagsM6G	seller
24	Rohan3	$2b$10$VzuQHskH4WYQ0eMlDDMT0.NMLFJEDHozvrKbTMP6jCVLTkEgeTAou	seller
\.


--
-- TOC entry 3379 (class 0 OID 0)
-- Dependencies: 217
-- Name: audit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.audit_id_seq', 213, true);


--
-- TOC entry 3380 (class 0 OID 0)
-- Dependencies: 213
-- Name: listings_listing_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.listings_listing_id_seq', 34, true);


--
-- TOC entry 3381 (class 0 OID 0)
-- Dependencies: 215
-- Name: prebookings_prebooking_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.prebookings_prebooking_id_seq', 113, true);


--
-- TOC entry 3382 (class 0 OID 0)
-- Dependencies: 211
-- Name: tokens_token_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tokens_token_id_seq', 65, true);


--
-- TOC entry 3383 (class 0 OID 0)
-- Dependencies: 209
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 28, true);


--
-- TOC entry 3211 (class 2606 OID 16606)
-- Name: audit audit_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit
    ADD CONSTRAINT audit_pkey PRIMARY KEY (id);


--
-- TOC entry 3205 (class 2606 OID 16537)
-- Name: listings listings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.listings
    ADD CONSTRAINT listings_pkey PRIMARY KEY (listing_id);


--
-- TOC entry 3207 (class 2606 OID 16587)
-- Name: prebookings prebookings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prebookings
    ADD CONSTRAINT prebookings_pkey PRIMARY KEY (prebooking_id);


--
-- TOC entry 3209 (class 2606 OID 16589)
-- Name: prebookings prebookings_prebooking_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prebookings
    ADD CONSTRAINT prebookings_prebooking_number_key UNIQUE (prebooking_number);


--
-- TOC entry 3201 (class 2606 OID 16521)
-- Name: tokens tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tokens
    ADD CONSTRAINT tokens_pkey PRIMARY KEY (token_id);


--
-- TOC entry 3203 (class 2606 OID 16523)
-- Name: tokens tokens_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tokens
    ADD CONSTRAINT tokens_user_id_key UNIQUE (user_id);


--
-- TOC entry 3197 (class 2606 OID 16512)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 3199 (class 2606 OID 16514)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 3216 (class 2620 OID 16614)
-- Name: listings log_listing_add; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER log_listing_add BEFORE INSERT ON public.listings FOR EACH ROW EXECUTE FUNCTION public.log_listing_add();


--
-- TOC entry 3217 (class 2620 OID 16610)
-- Name: listings log_listing_delete; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER log_listing_delete BEFORE DELETE ON public.listings FOR EACH ROW EXECUTE FUNCTION public.log_listing_delete();


--
-- TOC entry 3219 (class 2620 OID 16616)
-- Name: prebookings log_prebooking_add; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER log_prebooking_add BEFORE INSERT ON public.prebookings FOR EACH ROW EXECUTE FUNCTION public.log_prebooking_add();


--
-- TOC entry 3218 (class 2620 OID 16621)
-- Name: prebookings log_prebooking_delete; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER log_prebooking_delete BEFORE DELETE ON public.prebookings FOR EACH ROW EXECUTE FUNCTION public.log_prebooking_delete();


--
-- TOC entry 3214 (class 2606 OID 16590)
-- Name: prebookings fk_listing; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prebookings
    ADD CONSTRAINT fk_listing FOREIGN KEY (listing_id) REFERENCES public.listings(listing_id) ON DELETE CASCADE;


--
-- TOC entry 3212 (class 2606 OID 16524)
-- Name: tokens fk_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tokens
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 3213 (class 2606 OID 16538)
-- Name: listings fk_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.listings
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 3215 (class 2606 OID 16595)
-- Name: prebookings fk_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prebookings
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


-- Completed on 2022-06-11 10:30:20

--
-- PostgreSQL database dump complete
--

